import pandas as pd
import joblib
from sklearn.neighbors import NearestNeighbors
import fasttext


def getres(text):
    fasttextmodel = fasttext.load_model("fasttextmodel.bin")
    knnmodel = joblib.load("knnmodel.pkl")
    raw_data = pd.read_excel("text_dnd.xls")
    temp = pd.DataFrame()
    fasttextres = fasttextmodel.predict(text)
    categorieslist = list(raw_data.columns)
    temp = pd.DataFrame()
    for label in categorieslist:
        temp[label] = ['0']
    for i in range(3):
        new = fasttextres[0][i].replace('__label__', '')
        temp[new] = ['1']
    del temp['TEXT']
    knnres = knnmodel.kneighbors(temp, return_distance=False)
    return raw_data.loc[knnres[0], :]
