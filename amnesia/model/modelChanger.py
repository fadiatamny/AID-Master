import os
import shutil
import glob
import sys
import logging
from typing import Any
from .modelException import ModelException

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Changer_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)


class ModelChanger():
    def __init__(self, newPath: str = 'newModels', currentPath: str = 'currentModels', oldPath: str = 'oldModels') -> None:
        self.newPath = newPath
        self.currentPath = currentPath
        self.oldPath = oldPath

    def _fileCheck(self, hase: str) -> int:
        newmodels = len(glob.glob1(self.newPath, f'*{hase}*.bin'))
        currentmodels = len(glob.glob1(self.currentPath, f'*{hase}*.bin'))
        return newmodels, currentmodels

    def _moveingFiles(self, originPath: str, destPath: str, hase: str, numofmodels: list) -> None:
        for i in numofmodels:
            shutil.move(f'{originPath}/fasttext/fasttextmodel_{hase}_{i}',
                        f'{destPath}/fasttext/fasttextmodel_{hase}_{i}')
        
        shutil.move(f'{originPath}/knn/knnmodel_{hase}.pkl',
                    f'{destPath}/knn/knnmodel_{hase}.pkl')
        

    def _cleanfolder(folderPath: str) -> None:
        if len(os.listdir(folderPath)) < 1:
            return
        for file in os.scandir(folderPath):
            os.remove(file.path)

    def _gettingHaseAndNumbers(filePath: str, fileEnd: str) -> Any:
        files = os.listdir(filePath)
        numberlist = []
        for file in files:
            if file.endswith(fileEnd):
                hase = file.split('_')[1]
                numberlist.append(file.split('_')[2])
        return hase, numberlist

    def modelsMoving(self):
        ModelChanger._cleanfolder(folderPath=self.oldPath)
        currentHase, currentNumOfModels = ModelChanger._gettingHaseAndNumbers(
            filePath=self.currentPath, fileEnd='bin')
        newHase, newNumOfModels = ModelChanger._gettingHaseAndNumbers(
            filePath=self.newPath, fileEnd='bin')
        ModelChanger._moveingFiles(
            self=self, originPath=self.newPath, destPath=self.currentPath, hase=newHase, numofmodels=newNumOfModels)
        ModelChanger._moveingFiles(
            self=self, originPath=self.currentPath, destPath=self.oldPath, hase=currentHase, numofmodels=currentNumOfModels)


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modeslChanger.py [new_models_path] [current_models_path] [old_models_path] [number of fasttext models]')
        print('[new_models_path] = new models folder path')
        print('[current_models_path] = new models folder path')
        print('[old_models_path] = old models folder path')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modeslChanger.py -n [new_models_path] -c [current_models_path] -o [old_models_path]')
        sys.exit()

    oldPath: str = ''
    currentPath: str = ''
    newPath: str = ''

    for index, item in enumerate(sys.argv, 0):
        if item == '-n' and index + 1 < len(sys.argv):
            newPath = f'{sys.argv[index + 1]}'
        if item == '-c' and index + 1 < len(sys.argv):
            currentPath = f'{sys.argv[index + 1]}'
        if item == '-o' and index + 1 < len(sys.argv):
            oldPath = f'{sys.argv[index+1]}'

    try:
        switch = ModelChanger(newPath, currentPath, oldPath)
        switch.modelsMoving()
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')