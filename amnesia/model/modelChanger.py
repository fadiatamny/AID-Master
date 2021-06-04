import os
import shutil
import glob


class modelChanger():
    def __init__(self, newPath: str = 'newModels', currentPath: str = 'currentModels', oldPath: str = 'oldModels', numModels: int = 3) -> None:
        self.newPath = newPath
        self.currentPath = currentPath
        self.oldPath = oldPath
        self.numOfModels = numModels

    def _fileCheck(self, hase: str) -> int:
        newmodels = len(glob.glob1(self.newPath, f'*{hase}*.bin'))
        currentmodels = len(glob.glob1(self.currentPath, f'*{hase}*.bin'))
        return newmodels, currentmodels

    def _moveingFiles(self, originPath: str, destPath: str, hase: str) -> None:
        for i in range(self.numOfModels):
            shutil.move(f'{originPath}/fasttextmodel_{hase}_{i}.bin',
                        f'{destPath}/fasttextmodel_{hase}_{i}.bin')

    def _cleanfolder(self, folderPath: str) -> None:
        if len(os.scandir(folderPath)) < 1:
            return
        for file in os.scandir(folderPath):
            os.remove(file.path)

    def _gettingHase(self, filePath: str) -> str:
        files = os.listdir(filePath)
        for file in files:
            if file.endswith('bin'):
                return file.split('_')[1]

    @staticmethod
    def modelsMoving(self):
        numofnewmodels, numofcurrentmodels = modelChanger._fileCheck()
        modelChanger._cleanfolder(self.oldPath)
        currentHase = modelChanger._gettingHase(self.currentPath)
        newHase = modelChanger._gettingHase(self.newPath)
        modelChanger._moveingFiles(
            originPath=self.newPath, destPath=self.currentPath, hase=newHase)
        modelChanger._moveingFiles(
            originPath=self.currentPath, destPath=self.oldPath, hase=currentHase)
