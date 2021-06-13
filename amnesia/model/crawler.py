import logging
import requests
from bs4 import BeautifulSoup
import time

logging.basicConfig(
    format='%(asctime)s %(levelname)s:%(message)s',
    level=logging.INFO)


class Crawler:

    def __init__(self, urls, runs):
        self.urls = urls
        self.runs = runs

    def badLine(self, p):
        if p.get_text() == 'OR':
            return 1
        if p.find('a') or p.find('input'):
            return 2

        return 0

    def fetchScenario(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        div = soup.find('div', id="content")
        paragraphs = div.find_all('p')
        paragraphs.pop(0)
        processed = []
        for p in paragraphs:
            value = self.badLine(p)
            if value == 0:
                processed.append(p.get_text())
            elif value == 2:
                break
        return processed

    def crawl(self):
        items = []
        while self.urls:
            url = self.urls.pop(0)
            logging.info(f'Crawling: {url}')
            for i in range(self.runs):
                try:
                    res = requests.get(url).text
                    items = items + self.fetchScenario(res)
                except Exception:
                    logging.exception(f'Failed to crawl: {url}')
                time.sleep(1)
            time.sleep(5)
        return items


if __name__ == '__main__':
    urls = [
        'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
        'https://www.kassoon.com/dnd/plot-twist-generator/',
        'https://www.kassoon.com/dnd/puzzle-generator/'
    ]
    print(Crawler(urls=urls, runs=1).crawl())
