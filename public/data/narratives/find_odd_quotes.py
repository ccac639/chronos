f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()

fixed_count = 0
for i, line in enumerate(lines):
    count = line.count('"')
    if count % 2 != 0 and 'D(' in line:
        print(f"Line {i+1} has {count} quotes (odd), fixing...")
        # The issue is Chinese commas in consequence fields being interpreted as JS delimiters
        # Replace Chinese punctuation with periods to avoid confusion
        # Actually the real issue is that some text has commas that look like field separators
        # Let's just skip this approach and rewrite the file directly
        fixed_count += 1

print(f"Found {fixed_count} lines with odd quotes")

# Let's find ALL lines with odd quotes and show their line numbers
for i, line in enumerate(lines):
    count = line.count('"')
    if count % 2 != 0:
        print(f"  Line {i+1}: {count} quotes")

f.close()
