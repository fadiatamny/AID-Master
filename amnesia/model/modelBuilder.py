from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib
import os
import sys
import requests
import texthero as hero
import logging
from .modelException import ModelException
from .modelUtils import ModelUtils
import shutil
from datetime import datetime
from sklearn.model_selection import train_test_split
import random as rad

prefix = os.path.dirname(os.path.realpath(__file__))

if not os.path.isdir(f'{prefix}/logs'):
    os.mkdir(f'{prefix}/logs')
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
handler = logging.FileHandler(f'{prefix}/logs/logs_builder_{datetime.now().date()}.log')
formatter = '%(asctime)s %(levelname)s -- %(message)s'
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)

class ModelBuilder():
    @staticmethod
    def _formatText(data) -> None:
        headlist = list(data.columns.values)
        del headlist[0]
        # convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0, 1], [' ', '__label__'+i])
        # clean the text
        data["TEXT"] = hero.clean(data["TEXT"])
        # move the first TEXT colume to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data

    @staticmethod
    def _readRawData(filePath: str):
        type = filePath.split('.')[1]
        if type == 'csv':
            return pd.read_csv(filePath)
        elif type == 'xls' or type == 'xlsx':
            return pd.read_excel(filePath)
        else:
            raise Exception(
                'unable to read the dataset file, format not supported')

    @staticmethod
    # removing unnecessary file in the end of the process
    def cleanFiles(hash) -> None:
        if os.path.exists(f'training_data{hash}.txt'):
            os.remove(f'training_data{hash}.txt')
        if os.path.exists(f'validate_data{hash}.txt'):
            os.remove(f'validate_data{hash}.txt')
        if os.path.exists(f'testing_data{hash}.txt'):
            os.remove(f'testing_data{hash}.txt')
        if os.path.exists(f'processed_data{hash}.txt'):
            os.remove(f'processed_data{hash}.txt')

    @staticmethod
    # read the data file and creat the fasttext
    def createFastText(filePath: str, savePath: str = 'bin/newModels/fasttext', hashbase: str = '', time: int = 7000, debug: bool = False) -> None:
        try:

            raw_data = ModelBuilder._readRawData(filePath)
        except Exception as e:
            raise ModelException('builder', str(e))
        cleandata = ModelBuilder._formatText(raw_data)
        # removing validate for now until we have more data. split is 80 - 20
        for i in range(6):
            print(i)
            train, test = train_test_split(cleandata, test_size=0.2, random_state=rad.randrange(999))

            try:
                # np.savetxt(f'./validate_data{hash}.txt', validate.values, fmt='%s')
                np.savetxt(f'testing_data{hashbase}_{i}.txt', test.values, fmt='%s')
                np.savetxt(f'training_data{hashbase}_{i}.txt', train.values, fmt='%s')
            except Exception as e:
                raise ModelException(
                    'builder', f'unable to save the testing and training data files. {str(e)}')

        # creating the 5 base models and performing auto tune for 10 labels and 1.5h (5400s) and limiting the file size to 1G
        
        resDataFrame = pd.DataFrame(columns=['exmp', 'Percision', 'Recall'])

        try:
            for i in range(6):
                fastmodule = fasttext.train_supervised(
                    input=f'training_data{hashbase}_{i}.txt',
                    autotuneValidationFile=f'testing_data{hashbase}_{i}.txt', autotunePredictions=10,
                    autotuneDuration=time, autotuneModelSize='1000M')

                restest = fastmodule.test(f'testing_data{hashbase}_{i}.txt', 10)
                resDataFrame = resDataFrame.append(
                    {'exmp': restest[0], 'Percision': restest[1], 'Recall': restest[2]}, ignore_index=True)
                print(resDataFrame)
                fastmodule.save_model(
                    f'build/fasttextmodel_{hashbase}_{i}.bin')
        except Exception as e:
            for i in os.scandir('build'):
                os.remove(i.path)
            raise ModelException('builder', f'unable to create models. {str(e)}')

        # save the bast 3 fasttext models
        input("her")
        indexlist = resDataFrame.nlargest(3, 'Percision').index
        for i in indexlist:
            logger.debug(
                f'Moving to {savePath}/fasttextmodel_{hashbase}_{i}.bin')
            shutil.move(f'build/fasttextmodel_{hashbase}_{i}.bin',
                        f'{savePath}/fasttextmodel_{hashbase}_{i}.bin')
        for i in os.scandir('build'):
            os.remove(i.path)

        if debug:
            ModelBuilder._testModel(fastmodule, hash)
        # saving the model

        ModelBuilder.cleanFiles(hash)
        logger.debug('Generated FastText Model Successfully')

    @staticmethod
    def createKNN(filePath: str, savePath: str = 'bin/newModels/knn', k: int = 10, hash: str = '') -> None:
        try:
            raw_data = ModelBuilder._readRawData(filePath)
        except Exception as e:
            raise ModelException('builder', str(e))

        # preparing the data for the KNN by removing the TEXT
        knnData = raw_data.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(knnData)
        # saving the model
        joblib.dump(knn, f'{savePath}/knnmodel_{hash}.pkl')
        logger.debug('Generated KNN Model Successfully')

    @staticmethod
    def createModels(filePath: str, savePath: str = 'bin/newModels', time: int = 5400, k: int = 3, hash: str = '', debug: bool = False) -> None:
        cwd = os.getcwd()
        cwdcat = cwd.partition('model')
        os.chdir(f'{cwdcat[0]}/model/')
        try:
            ModelBuilder.createFastText(
                filePath=filePath, hashbase=hash, debug=debug, savePath=f'{savePath}/fasttext', time=time)
            ModelBuilder.createKNN(
                filePath=filePath, k=k, hash=hash, savePath=f'{savePath}/knn')
            logger.debug('Generated Models Successfully')
        except Exception as e:
            logger.critical(str(e))
            for file in os.scandir('build'):
                os.remove(file.path)
            for file in os.scandir('bin/newModels/fasttext'):
                os.remove(file.path)
            for file in os.scandir('bin/newModels/knn'):
                os.remove(file.path)
            raise ModelException('Builder', "unable to create the models")

        finally:
            ModelBuilder.cleanFiles(hash)
            os.chdir(cwd)


if __name__ == '__main__':
    cwd = os.getcwd()
    cwdcat = cwd.partition('model')
    os.chdir(f'{cwdcat[0]}/model/')
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelBuilder.py [datasheet] [save_path] [k-neighbors? = 10] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[k-neighbors] = k neighbors. default = 3')
        print('[Time] = build time default 5400 seconds')
        print('[hash] = hash to attach to model names. default = ""')
        print('[DEBUGGING] = prints test results after generation')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modelBuilder.py [datasheet] -s [save_path] -t [Time] -k [k-neighbors? = 3] -h [hash? = ""] -d')
        sys.exit()

    if not os.path.isdir('dataset'):
        os.mkdir('dataset')

    if not os.path.isfile(sys.argv[1]):
        # fetch n download it
        path = sys.argv[1].split('/')
        filename = path[len(path) - 1].split('.')[0]
        datasetConfig = ModelUtils.fetchDatasetConfig()
        r = requests.get(datasetConfig['url'], allow_redirects=True)
        with open(f'./dataset/{filename}.{datasetConfig["type"]}', 'wb') as f:
            f.write(r.content)
        logger.debug('Successfully downloaded data')

    if not os.path.isdir('build'):
        os.mkdir('build')

    if not os.path.isdir('bin'):
        os.mkdir('bin')

    if not os.path.isdir('bin/currentModels'):
        os.mkdir('bin/currentModels')

    if not os.path.isdir('bin/currentModels/fasttext'):
        os.mkdir('bin/currentModels/fasttext')

    if not os.path.isdir('bin/currentModels/knn'):
        os.mkdir('bin/currentModels/knn')

    if not os.path.isdir('bin/oldModels'):
        os.mkdir('bin/oldModels')

    if not os.path.isdir('bin/oldModels/fasttext'):
        os.mkdir('bin/oldModels/fasttext')

    if not os.path.isdir('bin/oldModels/knn'):
        os.mkdir('bin/oldModels/knn')

    if not os.path.isdir('bin/newModels'):
        os.mkdir('bin/newModels')

    if not os.path.isdir('bin/newModels/fasttext'):
        os.mkdir('bin/newModels/fasttext')

    if not os.path.isdir('bin/newModels/knn'):
        os.mkdir('bin/newModels/knn')

    if not os.path.isdir('bin/newModels/injectModels'):
        os.mkdir('bin/newModels/injectModels')

    if not os.path.isdir('bin/newModels/injectModels/fasttext'):
        os.mkdir('bin/newModels/injectModels/fasttext')

    if not os.path.isdir('bin/newModels/injectModels/knn'):
        os.mkdir('bin/newModels/injectModels/knn')

    k: int = 10
    s: str = ''
    h: str = ''
    d: bool = False
    t: int = 5400

    for index, item in enumerate(sys.argv, 0):
        if item == '-s' and index + 1 < len(sys.argv):
            s = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])
        if item == '-d':
            d = True
        if item == '-t' and index + 1 < len(sys.argv):
            t = int(sys.argv[index + 1])

    try:
        ModelBuilder.cleanFiles(h)
        ModelBuilder.createModels(
            filePath=sys.argv[1],
            savePath=s,
            k=k,
            hash=h,
            debug=d,
            time=t
        )
        os.chdir(cwd)

        # add http call to server to change model based on name and hash.
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')
    finally:
        ModelBuilder.cleanFiles(h)

#  python modelBuilder.py dataset/data.csv -s bin/newModels -k 10 -h 1234 -t 10
