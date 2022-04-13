echo "========= deploy begin =========== "
sudo ./net-pln.sh up
sudo ./net-pln.sh createChannel
sudo ./net-pln.sh deploySmartContract
echo "========= deploy done =========== "