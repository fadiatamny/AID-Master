from pandas.core.frame import DataFrame
from crawler import Crawler
import pandas as pd
import json
from modelRunner import ModelRunner
import texthero as hero



class dataimport():

    @staticmethod
    def runing():
        runner = ModelRunner('finModel/fastText','finModel/knn/knnmodel.pkl','data/data.csv')
        data = pd.read_csv("./data/data.csv")
        categorieslist = list(data.columns)
        #dataframe  = pd.DataFrame(json.load('amnesia/model/dataHeaders.json'))
        f = open('dataHeaders.json')
        lines =  f.read()
        dataframe = pd.DataFrame(json.loads(lines))
        urls = [
            'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
            'https://www.kassoon.com/dnd/plot-twist-generator/',
            'https://www.kassoon.com/dnd/puzzle-generator/'
        ]
        crawler = Crawler(urls,1)
        res = crawler.crawl()

        modeRes = runner.fullPredic(pd.Series.to_string(hero.clean(pd.Series(res[0])),index=False))
        

        # for label in categorieslist:
        #     dataframe[label] = ['0']
        
        print(modeRes)



if __name__ == '__main__':
    test = dataimport()
    test.runing()