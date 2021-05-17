from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib
import os
import sys
import requests
import datetime
import texthero as hero
import logging



logger =logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Runner_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)

class ModelBuilder():
    @staticmethod
    def _cleanText(data) -> None:
        headlist = list(data.columns.values)
        del headlist[0]
        # convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0, 1], [' ', '__label__'+i])
        #clean the text    
        data["TEXT"] = hero.clean(data["TEXT"])
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
    
    
    def loadModels():
        models =[]
        for i,j in zip(range(3),os.scandir('build')):
            models.append(fasttext.load_model(f'{os.path.abspath(j)}'))

    @staticmethod
    # read the data file and creat the fasttext
    def createFastText(filePath: str, hashbase: str='', debug: bool=False) -> None:
        raw_data = pd.read_excel(filePath)
        cleandata = ModelBuilder._cleanText(raw_data)
        print(hashbase)
        print(type(hashbase))
    
        # removing validate for now until we have mode data. split is 80 - 20
        train, test = np.split(cleandata.sample(
            frac=1), [int(.8*len(cleandata))])

        # np.savetxt(f'./validate_data{hash}.txt', validate.values, fmt='%s')
        np.savetxt(f'testing_data{hashbase}.txt', test.values, fmt='%s')
        np.savetxt(f'training_data{hashbase}.txt', train.values, fmt='%s')
        print("hii 1")
        # creating the 5 base models and performing auto tune for 10 labels and 1h (3600s)
        resDataFrame = pd.DataFrame(columns=['exmp','Percision','Recall'])
        for i in range(5):
            fastmodule = fasttext.train_supervised(
                input=f'training_data{hashbase}.txt',
                autotuneValidationFile=f'testing_data{hashbase}.txt', autotunePredictions=10, 
                autotuneDuration=600,autotuneModelSize='1500M')
            print(f'model {i}')
            restest = fastmodule.test(f'testing_data{hashbase}.txt',10)
            resDataFrame = resDataFrame.append({'exmp':restest[0],'Percision':restest[1],'Recall':restest[2]},ignore_index=True)
            fastmodule.save_model(f'build/fasttextmodel{i}.bin')

        # save the bast 3 fasttext models
        indexlist = resDataFrame.nlargest(3,'Percision').index
        for i in indexlist:
            os.rename(f'build/fasttextmodel{i}.bin',f'finModel/fasttextmodel{i}.bin')
        for i in os.scandir('build'):
            os.remove(i.path)

        if debug:
            ModelBuilder._testModel(fastmodule,hash)
        # saving the model
        
        ModelBuilder.cleanFiles(hash)
        print('Generated FastText Model Successfully')

    @staticmethod
    def createKNN(filePath: str, k: int, hash: str='') -> None:
        raw_data = pd.read_excel(filePath)
        # preparing the data for the KNN by removing the TEXT
        knnData = raw_data.drop(['TEXT'], axis=1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(knnData)
        # saving the model
        joblib.dump(knn, f'./finModel/knnmodel{hash}.pkl')
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
