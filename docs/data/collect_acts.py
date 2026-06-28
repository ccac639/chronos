import json
import os

files = ['batch2.json', 'batch3.json', 'batch4.json', 'remaining_acts.json', 'acts_part1.json', 
         'w9-world-wars-part2.json', 'group1.json', 'group2.json', 'group3.json', 'group4.json', 
         'group5.json', 'group6.json', 'group7.json', 'group8.json', 'w9-world-wars.json']

all_acts = {}

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            acts_list = []
            if isinstance(d, list):
                acts_list = d
            elif isinstance(d, dict) and 'acts' in d:
                acts_list = d['acts']
            
            for act in acts_list:
                aid = act.get('id', 'unknown')
                if aid not in all_acts:
                    all_acts[aid] = act
                    print('  Added: ' + aid + ' from ' + f)
                else:
                    pass
    except Exception as e:
        print(f + ': error - ' + str(e))

print('\nTotal unique acts: ' + str(len(all_acts)))
print('\nAll act IDs:')
for aid in sorted(all_acts.keys()):
    act = all_acts[aid]
    key_str = ' [KEY]' if act.get('isKeyAct') else ''
    print('  ' + aid + ': ' + act.get('title', '') + key_str)

# Count key acts
key_count = sum(1 for a in all_acts.values() if a.get('isKeyAct'))
print('\nKey acts: ' + str(key_count))
