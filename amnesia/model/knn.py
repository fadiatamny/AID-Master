from sklearn.neighbors import NearestNeighbors
import joblib 
import pandas as pd

class KnnModel():
    def __init__(self, filePath: str, k: int):
        self.createmodle(filePath, k)
    
    def createmodle(self, filePath: str, k: int):
        raw_data = pd.read_excel(filePath)
        notext = pd.DataFrame()
        notext = raw_data
        notext = notext.drop(['TEXT'], axis = 1)
        knn = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(notext)
        joblib.dump(knn, "./build/knnmodel.pkl")

if __name__ == '__main__':
    KnnModel('./data/data.xls', 3)
