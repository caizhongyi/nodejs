:: set "NODE_PATH=%~dp0\node_modules"  
  
::npm config set proxy null
::echo "set proxy null"
npm config set prefix "%~dp0\node_global"
echo "set prefix %~dp0\node_global"
npm config set cache "%~dp0\node_cache"
echo "set cache %~dp0\node_cache"

:: npm install spm-init   # һ��Ҫװ
:: npm install spm-build # һ��Ҫװ
:: npm install spm-doc   # һ��Ҫװ, ����ܺ�
:: npm install spm-publish  # �����������ģ�鵽seajs.org, ����ע��seajs.org��վ�û�
:: npm install spm-deploy  # �������Ӧ����ssh������������


:: echo "%PATH%"
