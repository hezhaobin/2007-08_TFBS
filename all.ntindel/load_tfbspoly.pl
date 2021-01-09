############################
#! /usr/bin/perl -w
#  Created Aug 3rd 2007
#  Modified Nov 29th 2007
#  To load the poly data
#  Hebin
############################

use DBI;
prepareDbh();
$dbh->do(qq{truncate table tfbs_poly});

die "Cannot open filename\n" unless open (f_file, "filename");
$n=0;

while ($file = <f_file>)
{
    chomp $file;
    die "cannot open $file\n" unless open (f_input, $file);
    $file =~ /(CE\d{4}).([0-9a-zA-Z]+)./;
    $region = $1;
    $chr_arm = $2;
    while ($line = <f_input>){
	$n ++;
	($coordinate, $mel, $alleles_no, $polytype, $sim, $polystate) = split(/\s+/, $line);
	$polyfreq = $sim =~ s/$mel/$mel/g;
	$polyfreq = $alleles_no - $polyfreq;
	$sim_temp = $sim;
	$sim_temp =~ tr/N//d;
	$sim_temp =~ s/$mel//g;
	if($sim_temp ne ''){
	    $simallele = substr($sim_temp, 0, 1);
	}else{
	    $simallele = $mel;
	}
	@sim = split(//, $sim);
	$sim = join(" ", @sim);
	die("$file\t$line\t$n\n") unless $dbh -> do(qq{insert into tfbs_poly
                      values
		      ($n, '$region', '$chr_arm', $coordinate, '$mel', '$simallele', '$sim', 
		       $polyfreq, $alleles_no, '$polytype', '$polystate', 'spacer')});
    }
    print "$region done.\n";
}



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
