################################
#  perl temp3.pl
#  Created May 26th 2008
#  To convert patser output
#  to a table for R analysis
#  Hebin
################################


use warnings;

open f_Input, $ARGV[0] || die "Cannot open file\n";

print "region\tpos\tstrand\tscore\tpvalue\tseq\n";
while($line = <f_Input>){
    chomp $line;
    (@array) = ();
    @array = split(/\s+/, $line);
    $strand = '+';
    if($array[3] =~ /C/){
	$strand = '-';
	$array[3] =~ tr/C//d;
    }
    print "$array[1]\t$array[3]\t$strand\t$array[5]\t$array[7]\t$array[9]\n";
}
