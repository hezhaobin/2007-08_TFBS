##############################
#  perl annotate_mysql.pl
#! /usr/bin/perl -w
#  Created Dec 4th 2007
#  To annotate the tfbs and 
#  tfbs_poly with my predict"
#  Hebin
##############################


use DBI;
prepareDbh();
die "Cannot open gff file..." unless
    open(f_Input, "best_match_PWM.gff");
$flank = 10;

#initialize the database
$dbh -> do(qq(UPDATE tfbs_poly p, tfbs t
	      SET p.tf_name = NULL
	      WHERE p.coordinate between t.fp_start-$flank and t.fp_end+$flank));
<f_Input>;<f_Input>;
if(0){
while($line = <f_Input>){
    @array = split(/\s+/, $line);##0:fpid, 1: chr_arm, 2: factor, 3: start, 4: end, 5: score, 6: strand, 7:, 8: note;
    ($region) = $array[8] =~ /(CE\d{4})/;
    $test = $dbh->do(qq(UPDATE tfbs 
			SET region = '$region', tfbs_start = $array[3], tfbs_end = $array[4], tfbs_score = $array[5], strand = '$array[6]'
			WHERE fpid = $array[0]));
    if(!$test){
	die "cannot update $array[0]";
    }
}
}
$test = $dbh->do(qq(UPDATE tfbs_poly p, tfbs t
		    SET p.tf_name = t.factor
		    WHERE p.chr_arm = t.chr_arm AND p.coordinate between t.tfbs_start and t.tfbs_end));
print $test, "\n";

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
