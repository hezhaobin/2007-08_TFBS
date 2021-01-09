################################
#  perl Count_variations.pl
#  Created Apr 17th 2008
#  To add pvalue for each tfbs
#  into table tfbs
#  Hebin
################################


use warnings;
use DBI;
prepareDbh();


####################
# Pick up a factor #
####################
open f_Input, "/Users/hebin/Documents/tfbs/OptimalPatserMatrices/PWMname.txt";
$flank = 5;
while($factor = <f_Input>){
    chomp $factor;
    #print "Examine $factor\n";
    $sth = $dbh -> prepare(qq(select fpid, region, chr_arm, fp_start, fp_end, tfbs_score
			      from tfbs 
			      where factor = '$factor' AND tfbs_score is not NULL order by region));
    $sth -> execute;
    (@array) = ();
    while(@array = $sth -> fetchrow_array){
	$query = (qq(select mel
		     from tfbs_poly
		     where region = '$array[1]' AND chr_arm = '$array[2]' AND coordinate between $array[3]-$flank and $array[4]+$flank));
	$sth2 = $dbh -> prepare($query);
	$sth2 -> execute;
	$mel = '';
	$sth2->bind_columns(\$m);
	while($sth2 -> fetch){
	    $mel = $mel.$m;
	}
	$sth2->finish;
	$score = $strand = $position = $pvalue = '';
	$patser_seq  = 'mel'."\t\\".$mel."\\\n";
	$result = `echo -n '$patser_seq'|
                   ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -t -s -c|
                   grep 'position'`;
	$result =~ /position\=\s+(\S+)\s+score\=\s+(\S+)\s+\S+\s+(\S+)/;
	#print "$1\t$2\n";
	$position = $1; $score = $2;
	if($position =~ /C/){
	    $strand = '-';
	}else{
	    $strand = '+';
	}
	if($score == $array[5]){
	    $dbh -> do(qq(update tfbs set strand = '$strand' where fpid = $array[0]));
	}else{
	    print "$array[0]\n$result\nNo match\n";
	}
	#getc();
    }
    $sth->finish;
}

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

