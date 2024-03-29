from model.modelChanger import ModelChanger
from model.modelRunner import ModelRunner
from model.modelTester import ModelTester
from model.modelBuilder import ModelBuilder
from unittest import TestCase
import os


class Testmodel(TestCase):
    def test_builderfasttext(self):
        ModelBuilder.createModels(
            "mockData/dataset/data.csv", "mockDatabin/newModels", 10, 1234, 10)
        filelist = os.listdir("mockData/bin/newModels/fasttext")
        self.assertEqual(len(filelist), 4)

    def test_builderknn(self):
        filelist = os.listdir("mockData/bin/newModels/knn")
        self.assertEqual("knnmodel_10.pkl", filelist[0])

    def test_modeltester(self):
        res = ModelTester.fastTextTest(
            "mockData/dataset/data.csv", "mockData/bin/newModels/fasttext", 3)
        self.assertEqual(51.870967741935495, res)

    def test_modelrunner(self):
        runner = ModelRunner(fastText='model/mockData/bin/currentModels/fasttext', fastTextCount=3,
                             knn='model/mockData/bin/currentModels/knn', dataPath='model/mockData/dataset')
        res = runner.predict("testing text")
        self.assertMultiLineEqual('{"special_encounter":0.1,"exposition_encounter":1.0,"combat_encounter":0.1,"exploration_encounter":0.6,"roll":0.1,"neutral_mood":1.0,"intense":0.8,"travel":0.2,"escape":0.2,"chase":0.3,"conversation":0.2,"invstigate":1.0,"hideout":1.0,"swamp":1.0,"cave":1.0,"noon":1.0,"day":1.0,"human":0.1,"goblin":0.8,"hobgoblin":0.5,"trap":0.1}', res)

    def test_modelchanger(self):
        changer = ModelChanger(newPath="mockData/filemoving/bin/newModels",
                               currentPath="mockData/filemoving/bin/currentModels", oldPath="mockData/filemoving/bin/oldModels")
        changer.modelsMoving()
        newmodles = os.listdir(
            "model/mockData/filemoving/bin/newModels/fasttext")
        currentmodles = os.listdir(
            "model/mockData/filemoving/bin/currentModels/fasttext")
        oldmodels = os.listdir(
            "model/mockData/filemoving/bin/oldModels/fasttext")
        all = {
            "new": newmodles,
            "current": currentmodles,
            "old": oldmodels
        }
        self.assertDictEqual(all, {'new': [], 'current': ['fasttextmodel_10_1.bin', 'fasttextmodel_10_0.bin', 'fasttextmodel_10_5.bin'], 'old': [
                             'fasttextmodel_1234_5.bin', 'fasttextmodel_1234_0.bin', 'fasttextmodel_1234_2.bin']})
