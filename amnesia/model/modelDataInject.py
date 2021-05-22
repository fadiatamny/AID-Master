from pandas.core.frame import DataFrame
from crawler import Crawler
import pandas as pd
import json
from modelRunner import ModelRunner


class dataimport():

    @staticmethod
    def runing():
        runner = ModelRunner('amnesia/model/finModel','finModel/knnmodel.pkl','data/data.csv')
        data = pd.read_csv("./data/data.csv")
        categorieslist = list(data.columns)
        #dataframe  = pd.DataFrame(json.load('amnesia/model/dataHeaders.json'))
        f = open('dataHeaders.json')
        lines =  f.read()
        print(json.loads(lines))
        dataframe = pd.DataFrame(json.loads(lines))
        print(dataframe)
        urls = [
        'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
        'https://www.kassoon.com/dnd/plot-twist-generator/',
        'https://www.kassoon.com/dnd/puzzle-generator/'
    ]
        crawler = Crawler(urls,1)
        res = crawler.crawl()
        modeRes = runner.predict(res[0])
        # for label in categorieslist:
        #     dataframe[label] = ['0']
        
        print(modeRes)



if __name__ == '__main__':
    modelPath = './'
    fastTextName = 'fasttextmodel.bin'
    knnName = 'knnmodel.pkl'
    model = ModelRunner(f'{modelPath}/build/{fastTextName}',
                        f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.csv')
    dataimport.runing()