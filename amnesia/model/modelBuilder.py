from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import fasttext
import joblib 
import os
import sys

class ModelBuilder():
    def _cleanText(data) -> None:
        headlist=list(data.columns.values)
        del headlist[0]
        #convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0,1],[' ','__label__'+i])
        #clean the text from end of line
        for i in range(len(data)):
            data['TEXT'][i] = data['TEXT'][i].replace("\n",' ')
        #move the first TEXT line to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data

    def createFastText(filePath: str, hash = '') -> None:
        #read the data file and creat the fasttext 
        raw_data = pd.read_excel(filePath)
        cleandata = ModelBuilder._cleanText(raw_data)
        np.savetxt(f'processed_data{hash}.txt',cleandata.values,fmt='%s')
        fastmodule = fasttext.train_supervised(input = f'./processed_data{hash}.txt',epoch = 50, lr=0.1, wordNgrams=2)
        fastmodule.save_model(f'./build/fasttextmodel{hash}.bin')
        if os.path.exists(f'processed_data{hash}.txt'): 
            os.remove(f'processed_data{hash}.txt')
        print('Generated FastText Model Successfully')

        
    def createKNN(filePath: str, k: int, hash = '') -> None:
        raw_data = pd.read_excel(filePath)
        notext = pd.DataFrame()
        notext = raw_data
        notext = notext.drop(['TEXT'], axis = 1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(notext)
        joblib.dump(knn, f'./build/knnmodel{hash}.pkl')
        print('Generated KNN Model Successfully')
    
    def createModels(filePath: str, k: int = 3, hash = '') -> None:
        ModelBuilder.createFastText(filePath, hash)
        ModelBuilder.createKNN(filePath, k, hash)
        print('Generated Models Successfully')


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print('Please follow format of modelBuilder.py [datasheet] [k-neighbors? = 3] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[k-neighbors] = k neighbors. default = 3')
        print('[hash] = hash to attach to model names. default = ""')
        sys.exit()

    if len(sys.argv) < 2:
        print('Please follow format of modelBuilder.py [datasheet] [k-neighbors? = 3] [hash? = ""]')
        sys.exit()

    try:
        ModelBuilder.createModels(
            filePath = sys.argv[1],
            k = 3, 
            hash = ''
        )

        #add http call to server to change model based on name and hash.
    except:
        print('Error has occured please check -h for help.')
