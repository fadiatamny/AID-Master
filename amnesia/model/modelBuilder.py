from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib
import os
import sys
import requests
import datetime


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
        # move the first TEXT colume to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data

    @staticmethod
    # testing the model accuracy
    def _testModel(model, hash: str) -> None:
        if not os.path.isdir('logs'):
            os.mkdir('logs')
        date = datetime.datetime.now()
        # proforming the auto test accuracy test in fasttext model
        testRes = model.test(f'./testing_data{hash}.txt', 10)
        allResFIle = open(f'./logs/test_{date.day}_{date.month}_{date.year}.txt', 'a')
        # saving the result for future analysis
        allResFIle.write('\n#########################################################\n')
        allResFIle.write(f'Time Stamp: {date}\n')
        allResFIle.write(f'HASH = {hash}\n')
        allResFIle.write(f'Number of Examples = {testRes[0]}\n')
        allResFIle.write(f'Percision = {round(testRes[1] * 100, 3)}%\n')
        allResFIle.write(f'Recall = {round(testRes[2] * 100, 3)}%\n')
        allResFIle.write('#########################################################\n')
        allResFIle.close()

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
    def createFastText(filePath: str, hash: str='', debug: bool=False) -> None:
        raw_data = pd.read_excel(filePath)
        cleandata = ModelBuilder._cleanText(raw_data)
        # spliting the data to 3 parts 60/20/20
        # train, validate, test = np.split(cleandata.sample(
        #     frac=1), [int(.6*len(cleandata)), int(.8*len(cleandata))])
    
        # removing validate for now until we have mode data. split is 80 - 20
        train, test = np.split(cleandata.sample(
            frac=1), [int(.8*len(cleandata))])
        # np.savetxt(f'./validate_data{hash}.txt', validate.values, fmt='%s')
        np.savetxt(f'./testing_data{hash}.txt', test.values, fmt='%s')
        np.savetxt(f'./training_data{hash}.txt', train.values, fmt='%s')
        # creating the model and performing auto tune for 10 labels and 5min (300s)
        # fastmodule = fasttext.train_supervised(
        #     input=f'./training_data{hash}.txt',
        #     autotuneValidationFile=f'./validate_data{hash}.txt', autotunePredictions=10, autotuneDuration=300)

        fastmodule = fasttext.train_supervised(
            input=f'./training_data{hash}.txt',
            autotuneValidationFile=f'./testing_data{hash}.txt', autotunePredictions=10, autotuneDuration=300)

        if debug:
            ModelBuilder._testModel(fastmodule,hash)
        # saving the model
        fastmodule.save_model(f'./build/fasttextmodel{hash}.bin')
        ModelBuilder.cleanFiles(hash)
        print('Generated FastText Model Successfully')

    @staticmethod
    def createKNN(filePath: str, k: int, hash: str='') -> None:
        raw_data = pd.read_excel(filePath)
        # preparing the data for the KNN by removing the TEXT
        knnData = raw_data.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(knnData)
        # saving the model
        joblib.dump(knn, f'./build/knnmodel{hash}.pkl')
        print('Generated KNN Model Successfully')

    @staticmethod
    def createModels(filePath: str, k: int = 3, hash: str='', debug: bool = False) -> None:
        ModelBuilder.createFastText(filePath, hash, debug)
        ModelBuilder.createKNN(filePath, k, hash)
        print('Generated Models Successfully')


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
        print(
            'Please follow format of modelBuilder.py [datasheet] -k [k-neighbors? = 3] -h [hash? = ""] -d')
        sys.exit()

    if not os.path.isdir('data'):
        os.mkdir('data')

    if not os.path.isfile(sys.argv[1]):
        # fetch n download it
        url = 'https://cdn.discordapp.com/attachments/703993474927820811/823254393041190922/text_dnd_big.xls'
        r = requests.get(url, allow_redirects=True)

        open('./data/data.xls', 'wb').write(r.content)
        print('Successfully downloaded data')

    if not os.path.isdir('build'):
        os.mkdir('build')

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
    except Exception as e:
        ModelBuilder.cleanFiles(h)
        print('Error has occured please check -h for help.')
        print('Stack;')
        print(e)
