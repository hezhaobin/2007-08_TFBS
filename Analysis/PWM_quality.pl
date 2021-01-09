##############################
# perl PWM_quality.pl
# Created Mar 28th 08
# To examine the sensitivity
# and specificity of PWMs
# hebin
##############################

use warnings;

#use XML::Simple;
#use Data::Dumper;
#my $simple = XML::Simple->new();
#my $PWM = $simple->XMLin($ARGV[0]);
#my (@nucl) = ('A', 'C', 'G', 'T');

##################################
# prepare the enhancer sequences #
##################################
use DBI;
prepareDbh();

open f_Factor, "/Users/hebin/Documents/tfbs/OptimalPatserMatrices/PWMname.txt" || die "cannot open file\n";
while($factor = <f_Factor>){
    #print "Factor: ";
    #$factor = <STDIN>;
    #chomp $factor;
    chomp $factor;
    open f_Output, ">$factor\_test\.fasta";

    $sth = $dbh->prepare(qq(SELECT distinct(region)
			    FROM tfbs
			    WHERE factor = '$factor'));
    $sth->execute;
    $sth->bind_columns(\$region);
    while($sth->fetch){
	if(!$region){next;}
	$file = `ls /Users/hebin/Documents/tfbs/crm_seqs | grep \"$region\"`;
	chomp $file;
	open f_Input, "/Users/hebin/Documents/tfbs/crm_seqs/$file";
	<f_Input>;
	$line = <f_Input>;
	chomp $line;
	$line =~ tr/\-//d;
	print f_Output "$region\t\\$line\\\n";
    }
    close f_Output;
    $sth->finish;
}
$dbh->disconnect;



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
