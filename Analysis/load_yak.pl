############################
#! /usr/bin/perl -w
#  Created Dec 21st 2007
#  To load the mel-yak
#  Hebin
############################

use DBI;
prepareDbh();
$dbh->do(qq{truncate table yak});

die "Cannot open filename\n" unless open (f_file, "filename");
$n=1;
while ($file = <f_file>)
{
    chomp $file;
    die "cannot open $file\n" unless open (f_input, $file);
    <f_input>;<f_input>;<f_input>;<f_input>;<f_input>;<f_input>;
    $region = substr($file, 0, 6);
    $line = <f_input>;
    $line =~ /chr(\d?[A-Za-z]?)\:(\d+)\-(\d+)/;
    $chr_arm = $1; $region_begin = $2; $region_end = $3;
    $line = <f_input>;
    chomp $line;
    $mel = '';
    while($line !~ /\>/){
	chop $line;
	$mel = $mel.$line;
	$line = <f_input>;
	chomp $line;
    }
    $yak = '';
    $line = <f_input>;
    chomp $line;
    while($line !~ /\>/){
	chop $line;
	$yak = $yak.$line;
	$line = <f_input>;
	chomp $line;
    }
    $coor = $region_begin;
    for($i = 1; $i < length($mel); $i ++){
	$m = substr($mel, $i, 1);
	$y = substr($yak, $i, 1);
	die("Cannot update mysql in $file") unless 
	    $dbh -> do(qq(insert into yak
			  values ($n, '$region', '$chr_arm', $coor, '$m', '$y')));
	$n ++;
	if($m ne '-'){
	    $coor ++;
	}
    }
    print "$region done. $coor\t$region_end\n";
}



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
