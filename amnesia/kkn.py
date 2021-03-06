from sklearn.neighbors import NearestNeighbors
import pandas as pd


def initandtruin(data,k):
    notext = pd.DataFrame()
    notext = data
    notext = notext.drop(['TEXT'], axis = 1)
    knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(notext)
    return knn

def knnfit(knn,text):
    return knn.kneighbors(text,return_distance=False)
