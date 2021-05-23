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
            raise Exception('unable to read the dataset file, format not supported')

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
    def createFastText(filePath: str,savePath:str, hashbase: str = '',time:str = 5400, debug: bool = False) -> None:
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
            raise ModelException('builder', 'unable to save the testing and training data files')

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
                fastmodule.save_model(f'build/fasttextmodel{i}.bin')
        except:
            raise ModelException('builder', 'unable to create models')
        finally:
            for i in os.scandir('build'):
                os.remove(i.path)

        # save the bast 3 fasttext models
        indexlist = resDataFrame.nlargest(3, 'Percision').index
        for i in indexlist:
            os.rename(f'build/fasttextmodel{i}.bin',
                      f'{savePath}fasttextmodel{i}.bin')
        input()
        for i in os.scandir('build'):
            os.remove(i.path)

        if debug:
            ModelBuilder._testModel(fastmodule, hash)
        # saving the model

        ModelBuilder.cleanFiles(hash)
        logger.log('Generated FastText Model Successfully')

    @staticmethod
    def createKNN(filePath: str, k: int, hash: str = '') -> None:
        try:
            raw_data = ModelBuilder.readRawData(filePath)
        except Exception as e:
            raise ModelException('builder', str(e))

        # preparing the data for the KNN by removing the TEXT
        knnData = raw_data.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(knnData)
        # saving the model
        joblib.dump(knn, f'./finModel/knn/knnmodel{hash}.pkl')
        logger.log('Generated KNN Model Successfully')

    @staticmethod
    def createModels(self, filePath: str, k: int = 3, hash: str = '', debug: bool = False) -> None:
        try:
            ModelBuilder.createFastText(filePath, hash, debug)
            ModelBuilder.createKNN(filePath, k, hash)
            logger.log('Generated Models Successfully')
        except:
            raise ModelException('Builder', "unable to create the models")
        finally:
            self.cleanFiles(hash)
            for i in os.scandir('build'):
                os.remove(i.path)
            for i in os.scandir('finModel'):
                os.remove(i.path)
    
if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelBuilder.py [datasheet] [k-neighbors? = 3] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[k-neighbors] = k neighbors. default = 3')
        print('[hash] = hash to attach to model names. default = ""')
        print('[DEBUGGING] = prints test results after generation')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modelBuilder.py [datasheet] -k [k-neighbors? = 3] -h [hash? = ""] -d')
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
        logger.log('Successfully downloaded data')


    if not os.path.isdir('build'):
        os.mkdir('build')

    if not os.path.isdir('finModel'):
        os.mkdir('finModel')

    k: int = 3
    h: str = ''
    d: bool = False

    for index, item in enumerate(sys.argv, 0):
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'_{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])
        if item == '-d':
            d = True

    try:
        ModelBuilder.cleanFiles(h)
        ModelBuilder.createModels(
            filePath=sys.argv[1],
            k=k,
            hash=h,
            debug=d
        )

        # add http call to server to change model based on name and hash.
    except ModelException as e:
        logger.critical(str(e))
    except Exception as e:
        logger.critical('Stack:', str(e))
    finally:
        print('Please check -h for help.')
        ModelBuilder.cleanFiles(h)
