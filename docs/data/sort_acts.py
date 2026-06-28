import json

with open('sw-medieval-asia-africa.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total acts: {len(data['acts'])}")

def sort_key(act_id):
    s = act_id.replace('act-', '')
    if 'b' in s:
        parts = s.split('b')
        return (int(parts[0]), 1)
    else:
        return (int(s), 0)

data['acts'].sort(key=lambda a: sort_key(a['id']))

print("\nAll act IDs:")
for i, act in enumerate(data['acts']):
    key_act = " [KEY]" if act['isKeyAct'] else ""
    print(f"  {i+1}. {act['id']} - {act['title']}{key_act}")

key_acts = [a for a in data['acts'] if a['isKeyAct']]
print(f"\nTotal key acts: {len(key_acts)}")
print("Key acts:", [(a['id'], a['title']) for a in key_acts])

with open('sw-medieval-asia-africa.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nSorted and saved.")
