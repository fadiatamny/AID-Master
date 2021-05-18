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

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Tester_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)


class ModelTester:

    @staticmethod
    def loadFasttextModels(path: str) -> list:
        modelsFasttext = []
        try:
            for j in os.scandir(path):
                if os.path.splitext(j)[1] == '.bin':
                    modelsFasttext.append(
                        fasttext.load_model(f'{os.path.abspath(j)}'))
        except:
            logger(f'unable to load the 3 FastText models')
        return modelsFasttext

    @staticmethod
    def pred(text: str, models: list)-> list:
        resF = []
        for i in range(3):
            resF.append(models[i].predict(text, k=10))
        allres = (tuple(list(resF[0][0])+list(resF[1][0])+list(resF[2][0])))
        finres = [key for key in Counter(
            allres).keys() if Counter(allres)[key] > 1]
        return finres

    @staticmethod
    def fastTextTest() -> None:
        fleg = 0
        tempDataframe = pd.DataFrame()
        data = pd.read_excel("./data/data.xls")
        finalres = np.zeros([data.index.size])
        categorieslist = list(data.columns)
        data["TEXT"] = hero.clean(data["TEXT"])
        models = ModelTester.loadFasttextModels()
        for i in data.index:
            predicateres = ModelTester.pred(data["TEXT"][i], models)
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
    test = ModelTester()
    test.fastTextTest(path)
