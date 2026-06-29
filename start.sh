#!/bin/bash
echo ""
echo "  ═════════════════════════════"
echo "   风尘录 Chronos - 一键启动"
echo "  ═══════════════════════════"
echo ""
echo "  [1/2] 安装依赖..."
npm install
echo ""
echo "  [2/2] 启动开发服务器..."
echo ""
echo "  启动成功后，请在浏览器中打开:"
echo "  http://localhost:3000"
echo ""
echo "  按 Ctrl+C 停止服务器"
echo "  ═══════════════════════════"
echo ""
npx next dev -p 3000
