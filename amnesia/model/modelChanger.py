import os
import shutil
import glob


class modelChanger():
    def __init__(self, newPath: str = 'newModels', currentPath: str = 'currentModels', oldPath: str = 'oldModels', numModels: int = 3, newModelHash: str = '') -> None:
        self.newPath = newPath
        self.currentPath = currentPath
        self.oldPath = oldPath
        self.numOfModels = numModels

    def _fileCheck(self) -> int:
        newmodels = len(glob.glob1(self.newPath, "*.bin"))
        currentmodels = len(glob.glob1(self.currentPath, "*.bin"))
        return newmodels, currentmodels

    def _moveingFiles(self, originPath: str, destPath) -> None:
        for i in range(self.numOfModels):
            shutil.move(f'{originPath}/fasttextmodel{i}.bin',
                        f'{destPath}/fasttextmodel{i}.bin')

    def _cleanfolder(self, folderPath: str) -> None:
        if len(os.scandir(folderPath)) < 1:
            return
        for file in os.scandir(folderPath):
            os.remove(file.path)

    @staticmethod
    def modelsMoving(self):
        numofnewmodels, numofcurrentmodels = self._fileCheck()
        self._cleanfolder(self.oldPath)
