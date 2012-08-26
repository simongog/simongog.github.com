outfile=Hk_table.txt

if [[ $# -lt 2 ]]; then
	echo "Usage: $0 file k"
	echo "      Calculates H_0,...,H_k for the text in file."
	exit 1
fi

./construct_CST $1
for i in `seq 0 $2`; do
	./calculate_Hk $1 ${i} >> ${outfile}
done
