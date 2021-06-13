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

    def _fileCheck(self, hash: str) -> int:
        newmodels = len(glob.glob1(self.newPath, f'*{hash}*.bin'))
        currentmodels = len(glob.glob1(self.currentPath, f'*{hash}*.bin'))
        return newmodels, currentmodels

    def _moveingFiles(self, originPath: str, destPath: str, hash: str, numofmodels: list) -> None:
        for i in numofmodels:
            shutil.move(f'{originPath}/fasttext/fasttextmodel_{hash}_{i}',
                        f'{destPath}/fasttext/fasttextmodel_{hash}_{i}')

        shutil.move(f'{originPath}/knn/knnmodel_{hash}.pkl',
                    f'{destPath}/knn/knnmodel_{hash}.pkl')

    def _cleanfolder(self, folderPath: str) -> None:
        if len(os.listdir(folderPath)) < 1:
            return
        for file in os.scandir(f'{folderPath}/fasttext'):
            os.remove(file.path)
        for file in os.scandir(f'{folderPath}/knn'):
            os.remove(file.path)

    def _gettingHashAndNumbers(self, filePath: str, fileEnd: str) -> Any:
        numberlist = []
        hash = ''

        files = os.listdir(f'{filePath}/fasttext')
        for file in files:
            if file.endswith(fileEnd):
                hash = file.split('_')[1]
                numberlist.append(file.split('_')[2])
        return hash, numberlist

    def _isEmptyDirectory(self, path: str, newModelCount: int):
        if len(os.listdir(f'{path}/fasttext')) != newModelCount:
            return False

        if len(os.listdir(f'{path}/knn')) != 1:
            return False

        return True

    def modelsMoving(self):
        self._cleanfolder(folderPath=self.oldPath)
        currentHash, currentNumListOfModels = self._gettingHashAndNumbers(
            filePath=self.currentPath, fileEnd='bin')
        newHash, newNumListOfModels = self._gettingHashAndNumbers(
            filePath=self.newPath, fileEnd='bin')
        self._moveingFiles(originPath=self.newPath, destPath=self.currentPath,
                           hash=newHash, numofmodels=newNumListOfModels)
        if not self._isEmptyDirectory(self.currentPath, newModelCount=len(newNumListOfModels)):
            self._moveingFiles(originPath=self.currentPath, destPath=self.oldPath,
                               hash=currentHash, numofmodels=currentNumListOfModels)


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
# python modelChanger.py -n bin/newModels -c bin/currentModels -o bin/oldModels
