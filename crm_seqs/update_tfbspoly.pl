############################
#! /usr/bin/perl -w
#  Modified Aug 28th 2007
#  To include the haplotype
#  information
#  Hebin
############################


use DBI;
prepareDbh();
#$dbh->do(qq{truncate table tfbs_poly});

die "Cannot open filename\n" unless open (f_file, "filename");
$n=1;

while (!eof(f_file))
{
    $file = <f_file>;
    chop $file;
    die "cannot open $file\n" unless open (f_input, $file);
    $file =~ /(CE\d{4}).([0-9a-zA-Z]+).(\d+)\-(\d+).fa/;
    $region = $1;
    $chr_arm = $2;
    $start = $3;
    $end = $4;
    ###########
    # Reading #
    ###########
    <f_input>;
    $mel = <f_input>;
    chop $mel;
    <f_input>;
    $c1674 = <f_input>;
    chop $c1674;
    <f_input>;
    $md106 = <f_input>;
    chop $md106;
    <f_input>;
    $md199 = <f_input>;
    chop $md199;
    <f_input>;
    $newc = <f_input>;
    chop $newc;
    <f_input>;
    $sim46 = <f_input>;
    chop $sim46;
    <f_input>;
    $w501 = <f_input>;
    chop $w501;
    for ($i = 0; $i < length($mel); $i ++){
	$a = substr($mel, $i, 1);
	$b = substr($c1674, $i, 1);
	$c = substr($md106, $i, 1);
	$d = substr($md199, $i, 1);
	$e = substr($newc, $i, 1);
	$f = substr($sim46, $i, 1);
	$g = substr($w501, $i, 1);
	$sim_alleles = $b.'|'.$c.'|'.$d.'|'.$e.'|'.$f.'|'.$g;
	$test = $dbh -> do(qq(update tfbs_poly set sim_alleles = '$sim_alleles'
			      where poly_id = $n AND mel = '$a'));
	if ($test == 1){
	    $n ++;
	}else{
	    print ("$file $n\n");
	}
    }
    print "$region finished\n";
}



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
