@echo off

pushd .  
%~d0     
cd %~dp0 

REM put this file in the Magento installation directory      

REM point this to the path of all the BSS files as an absolute path.

set source_path=C:\dev\prog\rewardsplatform

REM remove old links or files
rd  /s /q  .\app\code\community\TBT\RestApi
rd  /s /q  .\app\code\community\TBT\RewardsPlatform
del /s /q  .\app\design\adminhtml\default\default\layout\rewardsplatform.xml
rd  /s /q  .\app\design\adminhtml\default\default\template\rewardsplatform
del /s /q  .\app\design\frontend\base\default\layout\rewardsplatform.xml
rd  /s /q  .\app\design\frontend\base\default\template\rewardsplatform
del /s /q  .\app\etc\modules\TBT_RestApi.xml
del /s /q  .\app\etc\modules\TBT_RewardsPlatform.xml
rd  /s /q  .\js\tbt\rewardsplatform

REM rebuild directory struct  
md         .\app\code\community\TBT\
md         .\app\design\adminhtml\default\default\layout\
md         .\app\design\adminhtml\default\default\template\
md         .\app\design\frontend\base\default\layout\
md         .\app\design\frontend\base\default\template\
md         .\app\etc\modules\
md         .\js\tbt\

REM rebuild links                
mklink /D  .\app\code\community\TBT\RestApi              %source_path%\app\code\community\TBT\RestApi
mklink /D  .\app\code\community\TBT\RewardsPlatform      %source_path%\app\code\community\TBT\RewardsPlatform
mklink     .\app\design\adminhtml\default\default\layout\rewardsplatform.xml      %source_path%\app\design\adminhtml\default\default\layout\rewardsplatform.xml
mklink /D  .\app\design\adminhtml\default\default\template\rewardsplatform        %source_path%\app\design\adminhtml\default\default\template\rewardsplatform
mklink     .\app\design\frontend\base\default\layout\rewardsplatform.xml      %source_path%\app\design\frontend\base\default\layout\rewardsplatform.xml
mklink /D  .\app\design\frontend\base\default\template\rewardsplatform        %source_path%\app\design\frontend\base\default\template\rewardsplatform
mklink     .\app\etc\modules\TBT_RestApi.xml             %source_path%\app\etc\modules\TBT_RestApi.xml
mklink     .\app\etc\modules\TBT_RewardsPlatform.xml     %source_path%\app\etc\modules\TBT_RewardsPlatform.xml
mklink /D  .\js\tbt\rewardsplatform                      %source_path%\js\tbt\rewardsplatform

popd           


pause
