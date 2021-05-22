from pandas.core.frame import DataFrame
from crawler import Crawler
import pandas as pd
import json
from modelRunner import ModelRunner
import texthero as hero

class dataimport():
    @staticmethod
    def runing():
        runner = ModelRunner('finModel/fastText','finModel/knn/knnmodel.pkl')
        data = pd.read_csv("./data/data.csv")
        fleg =0
        f = open('dataset.headers.json')
        lines =  f.read()
        
        urls = [
            'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
            'https://www.kassoon.com/dnd/plot-twist-generator/',
            'https://www.kassoon.com/dnd/puzzle-generator/'
        ]
        crawler = Crawler(urls, 10)
        res = crawler.crawl()
        modeRes = []
        for i in range(len(res)):
            modeRes.append(runner.fastPredict(pd.Series.to_string(hero.clean(pd.Series(res[i])),index=False)))
        print(len(modeRes))

        for j in range(len(modeRes)):
            for i in range(len(modeRes[j])):
                dataframe = pd.DataFrame(json.loads(lines))
                new = modeRes[j][i].replace('__label__', '')
                dataframe[new] = [1]
            if fleg == 0:
                finalframe = dataframe
                fleg = 1
            else:
                finalframe = pd.concat(
                        [finalframe, dataframe], ignore_index=True)
        # for label in categorieslist:
        #     dataframe[label] = ['0']

        newdata = pd.concat([data,finalframe,data], ignore_index=True)
        print(newdata.shape)
        


if __name__ == '__main__':
    # modelPath = './'
    # fastTextName = 'fasttextmodel.bin'
    # knnName = 'knnmodel.pkl'
    # runner = ModelRunner(f'{modelPath}/build/{fastTextName}',
    #                      f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.csv')
    # dataPath = f'{modelPath}/data/data.csv'
    # headersPath = 'dataset.headers.json'
    dataimport.runing()


