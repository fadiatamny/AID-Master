import pandas as pd
import numpy as np
import fasttext




class fasttextmodle(filename):
    def __init__(self,filename):
        createmodle(filename)
    
    def cleantext(self,data):
        headlist=list(data.columns.values)
        del headlist[0]
        #convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0,1],[' ','__label__'+i])
        #clean the text from end of line
        for i in range(len(data)):
            raw_data['TEXT'][i] = data['TEXT'][i].replace("\n",' ')
        #move the first TEXT line to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data

    def createmodle(self,data):
        #read the data file and creat the fasttext 
        raw_data = pd.read_excel(data)
        cleandata = cleantext(raw_data)
        np.savetxt('text.txt',cleandata.values,fmt='%s')
        fastmodule = fasttext.train_supervised(input = './text.txt',epoch = 50, lr=0.1, wordNgrams=2)
        fastmodule.save_model("fasttextmodel.bin")
        


