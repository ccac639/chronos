import json

files = ['batch2.json', 'batch3.json', 'batch4.json', 'remaining_acts.json', 'acts_part1.json', 'w9-world-wars-part2.json', 'group1.json', 'group2.json', 'group3.json', 'group4.json', 'group5.json', 'group6.json', 'group7.json', 'group8.json']

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            if isinstance(d, list):
                print(f + ': ' + str(len(d)) + ' acts (list)')
            elif isinstance(d, dict) and 'acts' in d:
                print(f + ': ' + str(len(d['acts'])) + ' acts')
            else:
                print(f + ': unknown format')
    except Exception as e:
        print(f + ': error - ' + str(e))
