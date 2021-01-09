#################################
# perl Information_content.pl
# Divide sites into several
# categories and measure the 
# evolution rate
# hebin
#! /usr/bin/perl -W
#################################

use DBI;
prepareDbh();

###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/InfoContent.txt" ||
    die "Cannot open file\n";
(%pwml) = ();
while(!eof(f_Input)){
    ($factor, $width) = split(/\s+/, <f_Input>);
    $pwml{$factor} = $width;
    (@$factor) = ();
    @$factor = split(/\s+/, <f_Input>);
}
close(f_Input);

## to record ##
@total = (0,0,0,0,0,0,0,0,0);
@div = (0,0,0,0,0,0,0,0,0);
@poly = (0,0,0,0,0,0,0,0,0);

## driving table: tfbs ##
$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, anc_score, strand
			FROM tfbs 
			WHERE gapped = 'N'));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:anc_score; 6:strand;

$maxic = 0;
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    $sth3 = $dbh->prepare(qq(SELECT poly_Or_not, coordinate
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth3->execute;
    $sth3->bind_columns(\$poly, \$coordinate);
    while($sth3->fetch){
	#determine position->info content;
	$p = -1;
	if($strand eq '+'){
	    $p = $coordinate - $array[3];
	}elsif($strand eq '-'){
	    $p = $pwml{$factor} - ($coordinate - $array[3] + 1);
	}
	$ic = 0;
	$ic = $$factor[$p];
	$maxic = $ic if ($ic > $maxic);
	#divide into bins (0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8);
	$bin = -1;
	$bin = int($ic/0.2);
	$total[$bin] ++;
	$div[$bin] ++ if $poly eq "div";
	$poly[$bin] ++ if $poly eq "poly";
    }
    $sth3->finish;
}
$sth->finish;
$dbh->disconnect;
print "<0.3\t<0.6\t<0.9\t<1.2\t<1.5\n";
print join("\t", @total), "\n";
print join("\t", @div), "\n";
print join("\t", @poly), "\n";
print "maxic: $maxic\n";

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

sub Pi
{
    my $window = shift;
    my $plus = $window;
    $plus =~ tr/ACGT/0123/;
    my $minus = revcomp($window);
    $minus =~ tr/ACGT/0123/;
    my $splus = my $sminus = 0;
    for $j(0..($pwml{$factor}-1)){
	if(substr($plus, $j ,1) eq 'N'){
	    $splus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	    $sminus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	}else{
	    $splus += $$factor[4*$j+substr($plus, $j, 1)];
	    $sminus += $$factor[4*$j+substr($minus, $j, 1)];
	}
    }
    my $score = $splus >= $sminus ? $splus:$sminus;
    my $Pi = 0;
    $Pi = 1/(exp($ref{$factor}-$score)+1);
    return $Pi;
}

sub revcomp
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('',reverse(split(//, $seq)));
}

sub max
{
    my @array = @_;
    for $i(1..$#array){
	if($array[$i-1] > $array[$i]){
	    @array[$i-1, $i] = @array[$i, $i-1];
	}
    }
    return $array[-1];
}
