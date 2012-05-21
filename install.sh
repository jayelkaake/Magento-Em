#!/bin/bash
# Delete all of the directories / files and then symlink to them

if [ $# -ne 1 ]; then 
    echo "Usage: `basename $0` /full/path/to/magento/install"
    exit 1
fi

if [[ $1 != /* ]] ; then
    echo "Please specify the full path to your Magento install. Path must start with '/'"
    exit 1
fi

function linkme()
{
    rm -rf $destination/$1
    ln -s $source/$1 $destination/$1
}

function makedir()
{
    mkdir -p $destination/$1
}

if [[ $(pwd) != */dev/shell* ]] ; then
    echo "You must run this installer from within dev/shell/"
    exit 1
fi

cd ../..
source=$(pwd)
destination=$1

makedir     "app/code/community/TBT"
linkme      "app/code/community/TBT/RestApi"
linkme      "app/code/community/TBT/RewardsPlatform"

makedir     "app/code/local/Mage/SalesRule/Model/Rule/Condition"
linkme      "app/code/local/Mage/SalesRule/Model/Rule/Condition/Address.php"

linkme      "app/design/adminhtml/default/default/layout/rewardsplatform.xml"
linkme      "app/design/adminhtml/default/default/template/rewardsplatform"

linkme      "app/etc/modules/TBT_RestApi.xml"
linkme      "app/etc/modules/TBT_RewardsPlatform.xml"

linkme      "app/etc/modules/Mxperts_Jquery.xml"
linkme      "app/etc/modules/Mxperts_JqueryAll.xml"

linkme      "app/code/local/Mxperts"

linkme      "app/design/adminhtml/default/default/layout/jquerybase.xml"
linkme      "skin/adminhtml/default/default/rewardsplatform"

makedir     "js"
linkme      "js/jquery"

makedir     "dev/test/TBT"
linkme      "dev/test/TBT/RewardsPlatform"

# Let's cd back into the dev/shell directory.
cd dev/shell

