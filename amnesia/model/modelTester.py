import fasttext
import datetime
import pandas as pd
import numpy as np
import os
import sys
import requests


class ModelTester:
    @staticmethod
    def _cleanText(data) -> None:
        headlist = list(data.columns.values)
        del headlist[0]
        # convert the 0/1 vector to label that fit fasttext
        for i in headlist:
            data[i] = data[i].replace([0, 1], [' ', '__label__'+i])
        # clean the text from end of line
        for i in range(len(data)):
            data['TEXT'][i] = data['TEXT'][i].replace("\n", ' ')
        # move the first TEXT colume to the end
        first = data["TEXT"]
        del data['TEXT']
        data['TEXT'] = first
        return data

    @staticmethod
    def _initlizeTestFolder(date: datetime) -> None:
        if not os.path.isdir('tests'):
            os.mkdir('tests')

        if not os.path.isdir(f'./tests/test_{date.day}_{date.month}_{date.year}'):
            os.mkdir(f'./tests/test_{date.day}_{date.month}_{date.year}')

    @staticmethod
    def _genFastTextData(filePath: str, hash: str) -> None:
        raw_data = pd.read_excel(filePath)
        cleandata = ModelTester._cleanText(raw_data)

        train, test = np.split(cleandata.sample(frac=1),
                               [int(.8*len(cleandata))])
        np.savetxt(f'./testing_data{hash}.txt', test.values, fmt='%s')
        np.savetxt(f'./training_data{hash}.txt', train.values, fmt='%s')

    # removing unnecessary file in the end of the process
    @staticmethod
    def cleanFiles(hash) -> None:
        if os.path.exists(f'training_data{hash}.txt'):
            os.remove(f'training_data{hash}.txt')
        if os.path.exists(f'validate_data{hash}.txt'):
            os.remove(f'validate_data{hash}.txt')
        if os.path.exists(f'testing_data{hash}.txt'):
            os.remove(f'testing_data{hash}.txt')

    @staticmethod
    def fastTextTest(time: int, cycles: int, hash: str = '') -> None:
        date = datetime.datetime.now()
        ModelTester._initlizeTestFolder(date)

        print('\n#########################################################')
        print(f'Starting The {int(time/60)}m Tests:\t\t{date}')
        file = open(
            f'./tests/test_{date.day}_{date.month}_{date.year}/testRes#{int(time/60)}m.txt', 'a')
        for t in range(cycles):
            print(f'\tCycle #{t + 1}')
            model = fasttext.train_supervised(
                input=f'./training_data{hash}.txt', autotuneValidationFile=f'./testing_data{hash}.txt', autotunePredictions=10, autotuneDuration=time)
            res = model.test(f'testing_data{hash}.txt', 10)
            file.write(
                '\n#########################################################\n')
            file.write(f'Time Stamp: {date}\n')
            file.write(f'Test Number = {t + 1}\n')
            file.write(f'Number of Examples = {res[0]}\n')
            file.write(f'Percision = {round(res[1] * 100, 3)}%\n')
            file.write(f'Recall = {round(res[2] * 100, 3)}%\n')
            file.write(
                '#########################################################\n')
            file.flush()
        file.close()

    @staticmethod
    def specializedFastTextTest(filePath: str, time: int, cycles: int, hash: str = '') -> None:
        ModelTester._genFastTextData(filePath, hash)
        ModelTester.fastTextTest(time, cycles, hash)

    @staticmethod
    def generalFastTextTest(filePath: str, hash: str = '') -> None:
        ModelTester._genFastTextData(filePath, hash)

        print('Starting General Tests')
        for i in range(300, 2100, 300):
            ModelTester.fastTextTest(i, 3, hash)
        print('Finished All Tests')

    @staticmethod
    def runTests(filePath: str, hash: str = '') -> None:
        ModelTester.generalFastTextTest(filePath, hash)


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelTester.py [datasheet] [hash? = ""]')
        print('[datasheet] = the data sheet to build models based on')
        print('[hash] = hash to attach to model names. default = "" ( -h )')
        print('[Specialized] = Specialized test mode ( -F for fasttext and -K for knn )')
        sys.exit()

    if len(sys.argv) < 2:
        print(
            'Please follow format of modelTester.py [datasheet] -h [hash? = ""] -F | -K [Specialized] { must include -t for time and -c for cylces }')
        sys.exit()

    if not os.path.isdir('data'):
        os.mkdir('data')

    if not os.path.isfile(sys.argv[1]):
        # fetch n download it
        url = 'https://cdn.discordapp.com/attachments/703993474927820811/823254393041190922/text_dnd_big.xls'
        r = requests.get(url, allow_redirects=True)

        open('./data/data.xls', 'wb').write(r.content)
        print('Successfully downloaded data')

    h: str = ''
    fastTextTest = False
    cycles: int = -1
    time: int = -1

    for index, item in enumerate(sys.argv, 0):
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'_{sys.argv[index + 1]}'
        if item == '-F':
            fastTextTest = True
        if item == '-t' and index + 1 < len(sys.argv):
            time = int(sys.argv[index + 1])
        if item == '-c' and index + 1 < len(sys.argv):
            cycles = int(sys.argv[index + 1])

    if fastTextTest:
        if cycles == -1 or time == -1:
            print(
                'Please follow format of modelTester.py [datasheet] -h [hash? = ""] -F | -K [Specialized] { must include -t for time and -c for cylces }')
            sys.exit()

    try:
        ModelTester.cleanFiles(h)
        if fastTextTest:
            # python modelTester.py ./data/data.xls -F -t 1200 -c 6
            ModelTester.specializedFastTextTest(
                filePath=sys.argv[1], hash=h, time=time, cycles=cycles)
        else:
            # python modelTester.py ./data/data.xls
            ModelTester.runTests(
                filePath=sys.argv[1],
                hash=h,
            )

        # add http call to server to change model based on name and hash.
    except Exception as e:
        ModelTester.cleanFiles(h)
        print('Error has occured please check -h for help.')
        print('Stack;')
        print(e)
