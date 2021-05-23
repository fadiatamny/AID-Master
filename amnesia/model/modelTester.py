#from itertools import Predicate
import fasttext
import datetime
import pandas as pd
import numpy as np
import os
import sys
import requests
import texthero as hero
import logging
from collections import Counter
from amnesia.model.modelException import ModelException
from amnesia.model.modelUtils import ModelUtils

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Tester_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)

class ModelTester:
    @staticmethod
    def fastTextTest(dataPath: str, fastTextPath: str) -> None:
        fleg = 0
        tempDataframe = pd.DataFrame()
        data = pd.read_excel(dataPath)
        finalres = np.zeros([data.index.size])
        categorieslist = list(data.columns)
        data["TEXT"] = hero.clean(data["TEXT"])
        models = ModelUtils.loadFasttextModels(fastTextPath)
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
        print(finalres.size)
        finalres = finalres/10
        finalres = ((np.sum(finalres))/(data.index.size))*100
        logger.debug(f'the accuracy of the model is {finalres}')


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print( 'Please follow format of modelBuilder.py [datasheet] -f [fastText]')
        print('[datasheet] = the data sheet to build models based on')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error('Please follow format of modelBuilder.py [datasheet]')
        sys.exit()

    fastText: str = ''

    for index, item in enumerate(sys.argv, 0):
        if item == '-f' and index + 1 < len(sys.argv):
            fastText = str(sys.argv[index + 1])

    try: 
        ModelTester.fastTextTest(sys.argv[1], fastText)
    except ModelException as e:
        logger.critical(str(e))
    except Exception as e:
        logger.critical('Stack:', str(e))
    finally:
        print('Please check -h for help.')
    
