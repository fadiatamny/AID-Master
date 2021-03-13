from sklearn.neighbors import NearestNeighbors
import joblib 
import pandas as pd



class knnmodle(filename,k):
    def __init__(self,filename,k):
        createmodle(filename,k)
    
    def createmodle(self,filename,k):
        raw_data = pd.read_excel("text_dnd.xls")
        notext = pd.DataFrame()
        notext = raw_data
        notext = notext.drop(['TEXT'], axis = 1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(notext)
        joblib.dump(knn, "knnmodle.pkl")