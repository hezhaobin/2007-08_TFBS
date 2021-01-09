#################################
#! /usr/bin/perl -w
#  Adapted from load_tfbspoly.pl
#  To update the "sim_allele"
#  column
#  Hebin
#################################

use DBI;
prepareDbh();
$sth = $dbh->prepare(qq(SELECT poly_id, mel, sim_allele, sim_alleles
			FROM tfbs_poly));
$sth->execute;
$sth->bind_columns(\$poly_id, \$mel, \$sim_allele, \$sim_alleles);
while($sth->fetch){
    $sim_alleles =~ tr/N //d;
    $sim_alleles =~ s/$mel//g;
    if($sim_alleles eq ''){
	$sim = $mel;
    }else{
	$sim = substr($sim_alleles, 0, 1);
    }
    if($sim_allele ne $sim){
	$dbh->do(qq(UPDATE tfbs_poly
		    SET sim_allele = '$sim'
		    WHERE poly_id = $poly_id)) ||
		    die $poly_id;
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
