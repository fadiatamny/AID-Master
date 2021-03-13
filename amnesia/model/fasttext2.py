import pandas as pd
import numpy as np
import fasttext
import os

class FastTextModel():
    def __init__(self,filename: str):
        self._createModle(filename)
    
    def _cleanText(self, data):
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

    def _createModle(self, data):
        #read the data file and creat the fasttext 
        raw_data = pd.read_excel(data)
        cleandata = self._cleanText(raw_data)
        np.savetxt('processed_data.txt',cleandata.values,fmt='%s')
        fastmodule = fasttext.train_supervised(input = './processed_data.txt',epoch = 50, lr=0.1, wordNgrams=2)
        fastmodule.save_model("./build/fasttextmodel.bin")
        if os.path.exists('processed_data.txt'): 
            os.remove('processed_data.txt')
        

if __name__ == '__main__':
    FastTextModel('./data/data.xls')
