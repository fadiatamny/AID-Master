from model import ModelBuilder, DataInjector, ModelChanger, ModelRunner, ModelTester, ModelUtils, ModelException
import os
import sys
import logging
import requests
from datetime import datetime

prefix = os.path.dirname(os.path.realpath(__file__))

if not os.path.isdir(f'{prefix}/logs'):
    os.mkdir(f'{prefix}/logs')
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
handler = logging.FileHandler(
    f'{prefix}/logs/logs_{datetime.now().date()}.log')
formatter = '%(asctime)s %(levelname)s -- %(message)s'
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)


def runnerHelp():
    print(
        'Please follow format of modelRunner.py -f [FastText] -fn [FastText Number] -k [KNN] -d [Data]')
    print('[FastText] = the FastText models bin path')
    print('[FastText Number] = Number of FastText models')
    print('[KNN] = the KNN model bin path')
    print('[Data] = the location where your data is')

def runner():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        runnerHelp()
        return

    if len(sys.argv) < 4:
        logger.error('Please follow format of modelRunner.py -f [FastText] -fn [FastText Number] -k [KNN] -d [Data]')
        sys.exit()
    
    fastText: str = ''
    knn: str = ''
    dataPath: str = ''
    fastTextCount: int = 3

    for index, item in enumerate(sys.argv, 0):
        if item == '-k' and index + 1 < len(sys.argv):
            knn = str(sys.argv[index + 1])
        if item == '-f' and index + 1 < len(sys.argv):
            fastText = str(sys.argv[index + 1])
        if item == '-fn' and index + 1 < len(sys.argv):
            fastTextCount = int(sys.argv[index + 1])
        if item == '-d' and index + 1 < len(sys.argv):
            dataPath = str(sys.argv[index + 1])

    try:
        runner = ModelRunner(fastText, knn, fastTextCount, dataPath)

        text = input('Please insert text to be predicted')
        prediction = runner.predict(text)

        logger.debug(f'Prediction is:\n{prediction}')
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')

def testerHelp():
    print(
        'Please follow format of modelBuilder.py -d [dataSet] -m [modelsPath] -n [numbersModels]')
    print('[dataSet] = the data sheet to build models based on')
    print('[modelsPath] = the path for the fastText models you want to test')
    print('[numbersModels] = the number of models you want to test')


def tester():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        testerHelp()
        return

    if len(sys.argv) < 3:
        logger.error('Please follow format of modelBuilder.py -d [dataSet] -m [modelsPath] -n [numbersModels]')
        sys.exit()

    dataSet: str = ''
    modelsPath: str = ''
    numbersModels: int = 3

    for index, item in enumerate(sys.argv, 0):
        if item == '-d' and index + 1 < len(sys.argv):
            dataSet = f'{sys.argv[index + 1]}'
        if item == '-m' and index + 1 < len(sys.argv):
            modelsPath = f'{sys.argv[index + 1]}'
        if item == '-n' and index + 1 < len(sys.argv):
            numbersModels = int(sys.argv[index + 1])

    try:
        ModelTester.fastTextTest(
            dataPath=dataSet, fastTextPath=modelsPath, numberModels=numbersModels)
    except ModelException as e:
        print('Please check -h for help.')
        logger.critical(str(e))
    except Exception as e:
        print('Please check -h for help.')
        logger.critical('Stack:', str(e))


def builderHelp():
    print(
        'Please follow format of [datasheet] -s [save_path] -k [k-neighbors] -t [Time] -h [hash] -d [DEBUGGING]')
    print('[datasheet] = the data sheet to build models based on')
    print('[save-path] = the path to save the data to')
    print('[k-neighbors] = k neighbors. default = 3')
    print('[Time] = build time default 5400 seconds')
    print('[hash] = hash to attach to model names. default = ""')
    print('[DEBUGGING] = prints test results after generation')


def builder():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        builderHelp()
        return

    cwd = os.getcwd()
    cwdcat = cwd.partition('amnesia')
    os.chdir(f'{cwdcat[0]}/amnesia/model/')

    if len(sys.argv) < 5:
        logger.error(
            'Please follow format of modelBuilder.py [datasheet] -s [save_path] -k [k-neighbors] -t [Time] -h [hash] -d [DEBUGGING]')
        sys.exit()

    if not os.path.isdir('dataset'):
        os.mkdir('dataset')

    if not os.path.isfile(sys.argv[2]):
        # fetch n download it
        path = sys.argv[2].split('/')
        filename = path[len(path) - 1].split('.')[0]
        datasetConfig = ModelUtils.fetchDatasetConfig()
        r = requests.get(datasetConfig['url'], allow_redirects=True)
        with open(f'./dataset/{filename}.{datasetConfig["type"]}', 'wb') as f:
            f.write(r.content)
        logger.debug('Successfully downloaded data')
    
    if not os.path.isdir('build'):
        os.mkdir('build')

    if not os.path.isdir('bin'):
        os.mkdir('bin')

    if not os.path.isdir('bin/currentModels'):
        os.mkdir('bin/currentModels')

    if not os.path.isdir('bin/currentModels/fasttext'):
        os.mkdir('bin/currentModels/fasttext')

    if not os.path.isdir('bin/currentModels/knn'):
        os.mkdir('bin/currentModels/knn')

    if not os.path.isdir('bin/oldModels'):
        os.mkdir('bin/oldModels')

    if not os.path.isdir('bin/oldModels/fasttext'):
        os.mkdir('bin/oldModels/fasttext')

    if not os.path.isdir('bin/oldModels/knn'):
        os.mkdir('bin/oldModels/knn')

    if not os.path.isdir('bin/newModels'):
        os.mkdir('bin/newModels')

    if not os.path.isdir('bin/newModels/fasttext'):
        os.mkdir('bin/newModels/fasttext')

    if not os.path.isdir('bin/newModels/knn'):
        os.mkdir('bin/newModels/knn')

    if not os.path.isdir('bin/newModels/injectModels'):
        os.mkdir('bin/newModels/injectModels')

    if not os.path.isdir('bin/newModels/injectModels/fasttext'):
        os.mkdir('bin/newModels/injectModels/fasttext')

    if not os.path.isdir('bin/newModels/injectModels/knn'):
        os.mkdir('bin/newModels/injectModels/knn')
    
    k: int = 10
    savePath: str = ''
    hash: str = ''
    d: bool = False
    time: int = 5400

    for index, item in enumerate(sys.argv, 0):
        if item == '-s' and index + 1 < len(sys.argv):
            savePath = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            hash = f'{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])
        if item == '-d':
            d = True
        if item == '-t' and index + 1 < len(sys.argv):
            time = int(sys.argv[index + 1])

    try:
        ModelBuilder.cleanFiles(hash)
        ModelBuilder.createModels(
            filePath=sys.argv[2],
            savePath=savePath,
            k=k,
            hash=hash,
            debug=d,
            time=time
        )
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')
    finally:
        ModelBuilder.cleanFiles(hash)
        os.chdir(cwd)


def changeHelp():
    print(
        'Please follow format of -n [new_models_path] -c [current_models_path] -o [old_models_path]')
    print('[new_models_path] = new models folder path')
    print('[current_models_path] = new models folder path')
    print('[old_models_path] = old models folder path')


def change():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        changeHelp()
        return
    
    if len(sys.argv) < 3:
        logger.error(
            'Please follow format of -n [new_models_path] -c [current_models_path] -o [old_models_path]')
        sys.exit()

    oldPath: str = None
    currentPath: str = None
    newPath: str = None

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


def injectHelp():
    print('Please follow format of -d [data_path] -sm [save_models_path] -h [hash] -nm [number_of_models] -on [original_models_path] -o [old_Models_Path] -n [number of crawler rounds] -l [LOOP]')
    print('[data_Path] = new models folder path')
    print('[save_Models_Path] = new models folder path')
    print('[hash] = hash for new models = 10')
    print('[number_of_models] =number of new to creat and existing models')
    print('[original_models_path] = current models path')
    print('[old_Models_Path] = old models folder path')
    print('[number_Crawler] = the number of crawler rounds, diffult = 10')
    print('[loop] = number of loops')


def inject():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        injectHelp()
        return

    if len(sys.argv) < 8:
        logger.error(
            'Please follow format of -d [data_path] -sm [save_models_path] -h [hash] -nm [number_of_models] -on [original_models_path] -o [old_Models_Path] -n [number of crawler rounds] -l [LOOP]')
        sys.exit()

    data: str = None
    save: str = None
    hash: str = None
    crawlerRounds: int = None
    originalmodels: str = None
    loop: int = 1
    oldModels: str = None

    for index, item in enumerate(sys.argv, 0):
        if item == '-d' and index + 1 < len(sys.argv):
            data = f'{sys.argv[index + 1]}'
        if item == '-sm' and index + 1 < len(sys.argv):
            save = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            hash = f'{sys.argv[index+1]}'
        if item == '-on' and index + 1 < len(sys.argv):
            originalmodels = f'{sys.argv[index+1]}'
        if item == '-n' and index + 1 < len(sys.argv):
            crawlerRounds = int(sys.argv[index+1])
        if item == '-l' and index + 1 < len(sys.argv):
            loop = int(sys.argv[index+1])
        if item == '-o' and index + 1 < len(sys.argv):
            oldModels = f'{sys.argv[index+1]}'

    cwd = os.getcwd()
    cwdcut = cwd.partition('amnesia')
    os.chdir(f'{cwdcut[0]}/amnesia/model/')
    datadir = os.path.dirname(f'{data}')
    if not os.path.isdir(f'{datadir}/injectedData'):
        os.mkdir(f'{datadir}/injectedData')

    try:
        DataInjector.injectionLoop(dataPath=data, saveModelsPath=save, hash=hash,
                                   modelsPath=originalmodels, numberCrawler=crawlerRounds, oldPath=oldModels, loopCount=loop)
    except ModelException as e:
        print('Please check -h for help.')
        logger.critical(str(e))
    except Exception as e:
        print('Please check -h for help.')
        logger.critical('Stack:', str(e))
    finally:
        os.chdir(cwd)


def help():
    print('Modes that are supported:')
    print('[build] = The model builder module')
    print('[inject] = The model injection module')
    print('[change] = The model structure replacer module')
    print('[run] = The main model runner module')
    print('[test] = The model tester module')


def main():
    if len(sys.argv) < 2:
        logger.error('Please follow format of [Mode] or ask for help with -h')
        return
    mode = sys.argv[1]
    if mode == '-h' or mode == '-help':
        help()
    elif mode == 'build':
        builder()
    elif mode == 'inject':
        inject()
    elif mode == 'change':
        change()
    elif mode == 'run':
        runner()
    elif mode == 'test':
        tester()


if __name__ == '__main__':
    main()

# build - python main.py build dataset/data.csv -s bin/newModels -k 10 -h 1234 -t 10
# inject - python main.py inject -d dataset/data.csv -sm bin/newModels/injectModels -h 9876 -nm 3 -on bin/currentModels/ -o bin/oldModels -n 4 -l 1
# change - python main.py change -n bin/newModels -c bin/currentModels -o bin/oldModels
# tester - python main.py test -d dataset/data.csv -m bin/currentModels -n 3
# runner - python main.py run -f bin/currentModels/fasttext -fn 3 -k bin/currentModels/knn -d dataset/data.csv
