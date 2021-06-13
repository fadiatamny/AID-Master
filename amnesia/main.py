from model import *
import os
import sys
import logging
from datetime import datetime
import requests

prefix = os.path.dirname(os.path.realpath(__file__))

if not os.path.isdir('logs'):
    os.mkdir('logs')
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
handler = logging.FileHandler(f'{prefix}/logs/logs_{datetime.now()}.log')
formatter = '%(asctime)s %(levelname)s -- %(message)s'
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)

def builderHelp():
    print(
        'Please follow format of modelBuilder.py [datasheet] [save_path] [k-neighbors? = 10] [hash? = ""]')
    print('[datasheet] = the data sheet to build models based on')
    print('[k-neighbors] = k neighbors. default = 3')
    print('[Time] = build time default 5400 seconds')
    print('[hash] = hash to attach to model names. default = ""')
    print('[DEBUGGING] = prints test results after generation')

def builder():
    if sys.argv[2] == '-h' or sys.argv[2] == '-help' or sys.argv[2] == '--help':
        builderHelp()

    cwd = os.getcwd()
    cwdcat = cwd.partition('amnesia')
    os.chdir(f'{cwdcat[0]}/amnesia/model/')

    if len(sys.argv) < 3:
        logger.error(
            'Please follow format of modelBuilder.py [datasheet] -s [save_path] -t [Time] -k [k-neighbors? = 3] -h [hash? = ""] -d')
        sys.exit()

    if not os.path.isdir('dataset'):
        os.mkdir('dataset')

    if not os.path.isfile(sys.argv[1]):
        # fetch n download it
        path = sys.argv[1].split('/')
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
    s: str = ''
    h: str = ''
    d: bool = False
    t: int = 5400

    for index, item in enumerate(sys.argv, 0):
        if item == '-s' and index + 1 < len(sys.argv):
            s = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'{sys.argv[index + 1]}'
        if item == '-k' and index + 1 < len(sys.argv):
            k = int(sys.argv[index + 1])
        if item == '-d':
            d = True
        if item == '-t' and index + 1 < len(sys.argv):
            t = int(sys.argv[index + 1])

    try:
        ModelBuilder.cleanFiles(h)
        ModelBuilder.createModels(
            filePath=sys.argv[1],
            savePath=s,
            k=k,
            hash=h,
            debug=d,
            time=t
        )
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')
    finally:
        ModelBuilder.cleanFiles(h)
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
        pass
    elif mode == 'change':
        pass
    elif mode == 'run':
        pass
    elif mode == 'test':
        pass


if __name__ == '__main__':
    main()
