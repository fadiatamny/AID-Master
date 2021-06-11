from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib
import os
import sys
import requests
import datetime
import texthero as hero
import logging
import json
from modelException import ModelException
from modelUtils import ModelUtils
import shutil

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Runner_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
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
    def createFastText(filePath: str,savePath:str ='finModel/fastText', hashbase: str = '',time:int = 5400, debug: bool = False) -> None:
        try:
            raw_data = ModelBuilder._readRawData(filePath)
        except Exception as e:
            raise ModelException('builder', str(e))

        cleandata = ModelBuilder._formatText(raw_data)

        # removing validate for now until we have more data. split is 80 - 20
        train, test = np.split(cleandata.sample(
            frac=1), [int(.8*len(cleandata))])

        try:
            # np.savetxt(f'./validate_data{hash}.txt', validate.values, fmt='%s')
            np.savetxt(f'testing_data{hashbase}.txt', test.values, fmt='%s')
            np.savetxt(f'training_data{hashbase}.txt', train.values, fmt='%s')
        except:
            raise ModelException(
                'builder', 'unable to save the testing and training data files')

        # creating the 5 base models and performing auto tune for 10 labels and 1.5h (5400s) and limiting the file size to 1G
        resDataFrame = pd.DataFrame(columns=['exmp', 'Percision', 'Recall'])
        try:
            for i in range(5):
                fastmodule = fasttext.train_supervised(
                    input=f'training_data{hashbase}.txt',
                    autotuneValidationFile=f'testing_data{hashbase}.txt', autotunePredictions=10,
                    autotuneDuration=time, autotuneModelSize='1000M')

                restest = fastmodule.test(f'testing_data{hashbase}.txt', 10)
                resDataFrame = resDataFrame.append(
                    {'exmp': restest[0], 'Percision': restest[1], 'Recall': restest[2]}, ignore_index=True)
                fastmodule.save_model(f'build/fasttextmodel_{hashbase}_{i}.bin')
        except:
            for i in os.scandir('build'):
                os.remove(i.path)
            raise ModelException('builder', 'unable to create models')

        # save the bast 3 fasttext models
        indexlist = resDataFrame.nlargest(3, 'Percision').index
        print(indexlist)
        for i in indexlist:
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
    def createKNN(filePath: str, savePath: str, k: int, hash: str = '') -> None:
        try:
            raw_data = ModelBuilder._readRawData(filePath)
        except Exception as e:
            raise ModelException('builder', str(e))

        # preparing the data for the KNN by removing the TEXT
        knnData = raw_data.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(knnData)
        # saving the model
        joblib.dump(knn, f'./newModels/knn/knnmodel_{hash}.pkl')
        logger.debug('Generated KNN Model Successfully')

    @staticmethod
    def createModels(filePath: str, k: int = 3, hash: str = '', debug: bool = False) -> None:
        cwd = os.getcwd()
        cwdcat = cwd.partition('amnesia')
        os.chdir(f'{cwdcat[0]}/amnesia/model/')
        try:
            ModelBuilder.createFastText(filePath = filePath, hashbase = hash, debug = debug)
            input()
            ModelBuilder.createKNN(filePath = filePath, k = k, hash = hash)
            logger.debug('Generated Models Successfully')
        except:
            for file in os.scandir('build'):
                os.remove(file.path)
            for file in os.scandir('newModels'):
                os.remove(file.path)
            raise ModelException('Builder', "unable to create the models")

        finally:
            ModelBuilder.cleanFiles(hash)
            os.chdir(cwd)
        
    
if __name__ == '__main__':
    cwd = os.getcwd()
    cwdcat = cwd.partition('amnesia')
    os.chdir(f'{cwdcat[0]}/amnesia/model/')
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelBuilder.py [datasheet] [save_path] [k-neighbors? = 10] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[k-neighbors] = k neighbors. default = 3')
        print('[hash] = hash to attach to model names. default = ""')
        print('[DEBUGGING] = prints test results after generation')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modelBuilder.py [datasheet] -s [save_path] -k [k-neighbors? = 3] -h [hash? = ""] -d')
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

    if not os.path.isdir('currentModels'):
        os.mkdir('currentModels')

    if not os.path.isdir('currentModels/knn'):
        os.mkdir('currentModels/knn')

    if not os.path.isdir('oldModels'):
        os.mkdir('oldModels')

    if not os.path.isdir('newModels'):
        os.mkdir('newModels')

    if not os.path.isdir('newModels/knn'):
        os.mkdir('newModels/knn')

    if not os.path.isdir('newModels/injectModels'):
        os.mkdir('newModels/injectModels')

    if not os.path.isdir('newModels/injectModels/knn'):
        os.mkdir('newModels/injectModels/knn')

    k: int = 10
    s: str = ''
    h: str = ''
    d: bool = False

    for index, item in enumerate(sys.argv, 0):
        if item == '-s' and index + 1 < len(sys.argv):
            s = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])
        if item == '-d':
            d = True

    try:
        ModelBuilder.cleanFiles(h)
        ModelBuilder.createModels(
            filePath=sys.argv[1],
            savePaths=s,
            k=k,
            hash=h,
            debug=d
        )
        os.chdir(cwd)

        # add http call to server to change model based on name and hash.
    except ModelException as e:
        logger.critical(str(e))
    except Exception as e:
        logger.critical('Stack:', str(e))
    finally:
        print('Please check -h for help.')
        ModelBuilder.cleanFiles(h)
