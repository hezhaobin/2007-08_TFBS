###############################
#  perl make_weight_matrix.pl
#  Created Dec 26th 07
#  to convert alignment matrix
#  to weight matrix
#  hebin
#! /usr/bin/perl -w
###############################

$result = `ls ~/Documents/tfbs/OptimalPatserMatrices/PollardMatrices/*.cm`;
for $factor(split(/\n/, $result)){
    $seq = "a\t\\aa\\";
    $command = 'echo -n $seq |'."../patser/patser -A a:t 0.3 c:g 0.2 -m ".$factor." -p";
    $output = `$command`;
    $width = 0;
    for $line(split/\n/, $output){
	if($width > 0){
	    print $line, "\n";
	    $width --;
	}
	if($line =~ /width of the matrix/){
	    print $line, "\n";
	    $line =~ /\:\s(\d+)/;
	    $width = $1;
	}
    }
    print "\n";
}
