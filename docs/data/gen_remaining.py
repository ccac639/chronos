import json
import re

file_path = r'c:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\docs\data\w9-imperialism.json'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 act-15b 开始的位置，然后找到截断点
act_15b_start = content.find('"id": "act-15b"')
print(f"act-15b 起始位置: {act_15b_start}")

# 找到截断点 - 最后一个完整的对话字段
# 我们知道在 "consequence": "高压镇压积蓄怒火", 之后被截断了
truncation_marker = '"consequence": "高压镇压积蓄怒火",'
truncation_pos = content.find(truncation_marker)
print(f"截断标记位置: {truncation_pos}")

# 截断点之后的内容
remaining_truncated = content[truncation_pos + len(truncation_marker):]
print(f"截断后剩余内容长度: {len(remaining_truncated)}")
print(f"截断后内容: {repr(remaining_truncated[:200])}")

# 我们需要从截断点开始，补全 act-15b，然后添加新的 act
# 首先找到截断点 - 在第一个对话的中间
# 让我们构建新的内容

# 先获取到截断点之前的完整内容
# 实际上，让我们找到第一个对话（d1）开始的位置，然后重新构建整个 act-15b
d1_start = content.find('"id": "d1"', act_15b_start)
print(f"act-15b 中 d1 位置: {d1_start}")

# 获取 act-15b 开头到 d1 之前的部分
act_15b_header = content[act_15b_start:d1_start]
print(f"act-15b 头部长度: {len(act_15b_header)}")
print(f"act-15b 头部内容前200字符: {act_15b_header[:200]}")

# 现在我们需要：
# 1. 保留 act-15b 之前的所有内容（包括 act-15b 头部）
# 2. 补全 act-15b 的 9 个对话
# 3. 添加新的 act（act-16 到 act-30 以及分支 act）
# 4. 关闭 JSON 数组和对象

# 找到 acts 数组开始之前的所有内容
acts_start = content.find('"acts": [')
print(f"acts 数组起始位置: {acts_start}")

# 找到 act-15b 之前的内容结束位置
# 我们需要保留到 act-15 的完整内容，加上 act-15b 的头部
# 让我们找到 act-15 结束的位置
act_15_start = content.find('"id": "act-15"')
act_15b_start = content.find('"id": "act-15b"')
print(f"act-15 起始位置: {act_15_start}")
print(f"act-15b 起始位置: {act_15b_start}")

# 截断点在 act-15b 内部
# 我们需要重新构建 act-15b 和之后的所有内容

# 保留到截断标记之前的内容
base_content = content[:truncation_pos + len(truncation_marker)]
print(f"基础内容长度: {len(base_content)}")

print("\n准备生成剩余内容...")
