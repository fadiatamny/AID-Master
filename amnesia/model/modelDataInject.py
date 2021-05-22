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
            try:
                print('\n\n\n\n________________________________________________________________')
                print(res[i])
                series = pd.Series(res[i])
                print(series)
                series = hero.clean(series)
                print(series)
                toString = pd.Series.to_string(series,index=False)
                print(f'String:   {toString}')
                modeRes.append(runner.fastPredict(toString))
            except:
                input()
        print(len(modeRes))

        for j in range(len(modeRes)):
            for i in range(len(modeRes[j])):
                dataframe = pd.DataFrame(json.loads(lines))
                new = modeRes[j][i].replace('__label__', '')
                dataframe[new] = [1]
                dataframe["TEXT"] = res[j]
            if fleg == 0:
                finalframe = dataframe
                fleg = 1
            else:
                finalframe = pd.concat(
                        [finalframe, dataframe], ignore_index=True)
        # for label in categorieslist:
        #     dataframe[label] = ['0']
        print(finalframe)
        input()

        newdata = pd.concat([data,finalframe], ignore_index=True)
        newdata.to_csv('temp.csv',index=False)
        


if __name__ == '__main__':
    # modelPath = './'
    # fastTextName = 'fasttextmodel.bin'
    # knnName = 'knnmodel.pkl'
    # runner = ModelRunner(f'{modelPath}/build/{fastTextName}',
    #                      f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.csv')
    # dataPath = f'{modelPath}/data/data.csv'
    # headersPath = 'dataset.headers.json'
    dataimport.runing()


