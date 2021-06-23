import pandas as pd
import numpy as np
import os
import sys
import texthero as hero
import logging
from .modelException import ModelException
from .modelUtils import ModelUtils
from datetime import datetime

prefix = os.path.dirname(os.path.realpath(__file__))

if not os.path.isdir(f'{prefix}/logs'):
    os.mkdir(f'{prefix}/logs')
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
handler = logging.FileHandler(f'{prefix}/logs/logs_tester_{datetime.now().date()}.log')
formatter = '%(asctime)s %(levelname)s -- %(message)s'
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)



class ModelTester:
    @staticmethod
    def fastTextTest(dataPath: str, fastTextPath: str, numberModels: int):
        cwd = os.getcwd()
        cwdcat = cwd.partition('model')
        os.chdir(f'{cwdcat[0]}/model/')
        fleg = 0
        tempDataframe = pd.DataFrame()
        data = pd.read_csv(dataPath)
        finalres = np.zeros([data.index.size])
        categorieslist = list(data.columns)

        data["TEXT"] = hero.clean(data["TEXT"])
        models = ModelUtils.loadFasttextModels(path=fastTextPath,numModels = numberModels)
        for i in data.index:
            predicateres = ModelUtils.fastPredict(data["TEXT"][i], models)
            for label in categorieslist:
                tempDataframe[label] = [0]
            for i in range(len(predicateres)):
                new = predicateres[i].replace('__label__', '')
                tempDataframe[new] = [1]
            if fleg == 0:
                finalframe = tempDataframe
                fleg = 1
            else:
                finalframe = pd.concat(
                    [finalframe, tempDataframe], ignore_index=True)
        compareres = finalframe.compare(data, keep_shape=True, keep_equal=True)
        for i in compareres.index:
            for j in categorieslist:
                if compareres[j]["self"][i] == 1 and compareres[j]["self"][i] == compareres[j]["other"][i]:
                    finalres[i] = finalres[i]+1
        finalres = finalres/10
        finalres = ((np.sum(finalres))/(data.index.size))*100
        logger.debug(f'the accuracy of the model is {finalres}')
        os.chdir(cwd)
        return finalres


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelBuilder.py -d [dataSet] -m [modelsPath] -n [numbersModels]')
        print('[dataSet] = the data sheet to build models based on')
        print('[modelsPath] = the path for the fastText models you want to test')
        print('[numbersModels] = the number of models you want to test')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error('Please follow format of modelBuilder.py -d [dataSet] -m [modelsPath] -n [numbersModels]')
        sys.exit()

    dataSet: str = ''
    modelsPath: str = ''
    numbersModels: int = 3

    for index, item in enumerate(sys.argv, 0):
        if item == '-d' and index + 1 < len(sys.argv):
            dataSet = f'{sys.argv[index + 1]}'
        if item == '-m' and index + 1 < len(sys.argv):
            modelsPath = f'{sys.argv[index + 1]}'
        if item == '-n' and index + 1 < len(sys.argv):
            numbersModels = int(sys.argv[index + 1])

    try:
        ModelTester.fastTextTest(dataPath=dataSet,fastTextPath=modelsPath,numberModels=numbersModels)
    except ModelException as e:
        print('Please check -h for help.')
        logger.critical(str(e))
    except Exception as e:
        print('Please check -h for help.')
        logger.critical('Stack:', str(e))
