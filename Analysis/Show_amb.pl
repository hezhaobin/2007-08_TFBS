########################
# perl Show_amb.pl
# June 28th 08
# To print out cases 
# of ambiguous ancestry 
# to solve
# hebin
########################

use Warnings;

use DBI;
prepareDbh();

open f_Input, "../Result/effect_changes.txt" || die "cannot open file.";

<f_Input>;

while($line = <f_Input>){
    (@array) = ();
    @array = split(/\s+/, $line);
    if($array[5] eq 'Amb'){
	print $line;
	$sth0 = $dbh->prepare(qq(select chr_arm, tfbs_start, tfbs_end
				 from tfbs
				 where fpid = '$array[1]'));
	$sth0->execute;
	$sth0->bind_columns(\$chr, \$start, \$end);
	$sth0->fetch();
	$sth = $dbh->prepare(qq(SELECT coordinate, yak, mel, sim_alleles
				FROM tfbs_poly
				WHERE region = '$array[0]' and coordinate between $start and $end));
	$sth->execute;
	DBI::dump_results($sth);
	print "chr",$chr,':', $start+1, '-', $end+1, "\n";
	getc();
    }
}
	
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
