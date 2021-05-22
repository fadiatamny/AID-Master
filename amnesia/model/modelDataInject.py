from crawler import Crawler
import pandas as pd

class dataimport():

    @staticmethod
    def runing():
        data = pd.read_csv("./data/data.csv")
        categorieslist = list(data.columns)
        dataframe  = pd.DataFrame()
        urls = [
        'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
        'https://www.kassoon.com/dnd/plot-twist-generator/',
        'https://www.kassoon.com/dnd/puzzle-generator/'
    ]
        crawler = Crawler(urls,1)
        res = crawler.crawl()
        for label in categorieslist:
            dataframe[label] = ['0']
        for i in range(res):
            dataframe['TEXT']
        print(dataframe)



if __name__ == '__main__':
    test = dataimport()
    test.runing()