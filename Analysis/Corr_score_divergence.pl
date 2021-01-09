################################
# perl Corr_score_divergence.pl
# Created Dec 19th 07
# To query the tfbs and 
# tfbs_poly database for the 
# info listed in the table 
# header below
# hebin
#! /usr/bin/perl -W
################################

###############################################
# region fpid factor length score div poly exp
###############################################

open f_Output, ">../Result/Score_divergence.txt" ||
    die "Cannot open file";
print f_Output "region\tfpid\tfactor\tlength\tscore\tcons\tdiv\tpoly\tindel\n";

## driving table: tfbs ##
use DBI;
prepareDbh();

$sth = $dbh->prepare(qq(SELECT fpid, factor, chr_arm, tfbs_start start, tfbs_end end, tfbs_score score, region 
			FROM tfbs 
			WHERE tfbs_score is not NULL));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:chr_arm; 3:tfbs_start; 4:tfbs_end; 5:tfbs_score; 6:region;
while(@array = $sth->fetchrow_array){
    $sth2 = $dbh->prepare(qq(SELECT poly_Or_not poly, count(*) count
			     FROM tfbs_poly
			     WHERE region = '$array[6]'  AND coordinate between $array[3] and $array[4] AND polytype = 'nt'
			     GROUP by poly_Or_not));
    $sth2->execute;
    $sth2->bind_columns(\$poly, \$count);
    $count{poly}=0;$count{div}=0;$count{mono}=0;$count{polydiv}=0;
    while($sth2->fetch){
	$count{$poly} = $count;
    }
    $sth2->finish;
    $length = $array[4]-$array[3]+1;
    $indel = $length - $count{mono} - $count{div} - $count{poly};
    print f_Output "$array[6]\t$array[0]\t$array[1]\t$length\t$array[5]\t$count{mono}\t$count{div}\t$count{poly}\t$indel\n";
}
$sth->finish;
$dbh->disconnect;
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
