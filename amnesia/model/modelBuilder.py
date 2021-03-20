from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib
import os
import sys
import requests


class ModelBuilder():
    @staticmethod
    def _cleanText(data) -> None:
        headlist = list(data.columns.values)
        del headlist[0]
        # convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0, 1], [' ', '__label__'+i])
        # clean the text from end of line
        for i in range(len(data)):
            data['TEXT'][i] = data['TEXT'][i].replace("\n", ' ')
        # move the first TEXT line to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data
    
    @staticmethod
    def _testModel(model) -> None:
        allResFIle = open('testRes.txt','a')
        testRes = model.test(f'test_data{hash}.txt',10)
        allResFIle.write(f'{testRes[0]} {testRes[1]} {testRes[2]} \n')
        allResFIle.close()


    @staticmethod
    def createFastText(filePath: str, hash='') -> None:
        # read the data file and creat the fasttext
        raw_data = pd.read_excel(filePath)
        cleandata = ModelBuilder._cleanText(raw_data)
        #spliting the data to 3 parts 60/20/20 
        train, validate, test = np.split(cleandata.sample(
            frac=1), [int(.6*len(cleandata)), int(.8*len(cleandata))])
        np.savetxt(f'validate_data{hash}.txt', validate.values, fmt='%s')
        np.savetxt(f'test_data{hash}.txt', test.values, fmt='%s')
        np.savetxt(f'processed_data{hash}.txt', train.values, fmt='%s')
        fastmodule = fasttext.train_supervised(
            input=f'./processed_data{hash}.txt',
            autotuneValidationFile=f'./validate_data{hash}.txt', autotunePredictions=10, autotuneDuration=1500)
        fastmodule.save_model(f'./build/fasttextmodel{hash}.bin')
        if os.path.exists(f'processed_data{hash}.txt'):
            os.remove(f'processed_data{hash}.txt')
        print('Generated FastText Model Successfully')

    @staticmethod
    def createKNN(filePath: str, k: int, hash='') -> None:
        raw_data = pd.read_excel(filePath)
        notext = pd.DataFrame()
        notext = raw_data
        notext = notext.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(notext)
        joblib.dump(knn, f'./build/knnmodel{hash}.pkl')
        print('Generated KNN Model Successfully')

    @staticmethod
    def createModels(filePath: str, k: int = 3, hash='') -> None:
        ModelBuilder.createFastText(filePath, hash)
        ModelBuilder.createKNN(filePath, k, hash)
        print('Generated Models Successfully')


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelBuilder.py [datasheet] [k-neighbors? = 3] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[k-neighbors] = k neighbors. default = 3')
        print('[hash] = hash to attach to model names. default = ""')
        sys.exit()

    if len(sys.argv) < 2:
        print(
            'Please follow format of modelBuilder.py [datasheet] -k [k-neighbors? = 3] -h [hash? = ""]')
        sys.exit()

    if not os.path.isdir('data'):
        os.mkdir('data')

    if not os.path.isfile(sys.argv[1]):
        # fetch n download it
        url = 'https://cdn.discordapp.com/attachments/703993474927820811/821805778302009395/data.xls'
        r = requests.get(url, allow_redirects=True)

        open('./data/data.xls', 'wb').write(r.content)

    if not os.path.isdir('build'):
        os.mkdir('build')

    k: int = 3
    h: str = ''

    for index, item in enumerate(sys.argv, 0):
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'_{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])

    try:
        ModelBuilder.createModels(
            filePath=sys.argv[1],
            k=k,
            hash=h
        )

        # add http call to server to change model based on name and hash.
    except Exception as e:
        if os.path.exists(f'processed_data{h}.txt'):
            os.remove(f'processed_data{h}.txt')
        print('Error has occured please check -h for help.')
        print('Stack;')
        print(e)
