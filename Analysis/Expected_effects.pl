#################################
# perl Expected_effects.pl
# Created Dec 26th 07
# If someone were to randomly 
# sprinkle mutations onto the 
# identified binding sites,
# What's the expected # of
# changes of certain effects
# hebin
#! /usr/bin/perl -W
#################################

open f_Output, ">../Result/expected_effects.txt" ||
    die "Cannot open file";
print f_Output "region\tfactor\tfpid\teffect\tprob\n";

###################
# Mutation Matrix #
###################
$subpro{"AC"}=18.7704421562689;
$subpro{"AG"}=57.9043004239855;
$subpro{"AT"}=23.3252574197456;
$subpro{"CA"}=19.6289892447909;
$subpro{"CG"}=12.9765847082613;
$subpro{"CT"}=67.3944260469478;
$subpro{"GA"}=66.688479421388;
$subpro{"GC"}=14.3791975202342;
$subpro{"GT"}=18.9323230583778;
$subpro{"TA"}=20.0722521898352;
$subpro{"TC"}=66.7392487751769;
$subpro{"TG"}=13.1884990349879;

@nucl = ('A', 'C', 'G', 'T');

###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
while(!eof(f_Input)){
    $line = <f_Input>;
    $line =~ /Matrices\/(\S+)\"\:\ (\d+)/;
    $factor = $1; $width = $2;
    (@$factor) = ();
    <f_Input>;
    for($i = 0; $i < $width; $i ++){
	$line = <f_Input>;
	(@array) = ();
	@array = split(/\s+/, $line);
	$array[0] ne '' || shift(@array);#discard the first empty element;
	push(@$factor, @array);
    }
    #print "$factor uploaded\n";
    <f_Input>;
}
close(f_Input);

## driving table: tfbs ##
use DBI;
prepareDbh();

$amb = 0;
$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, anc_score, strand
			FROM tfbs 
			WHERE gapped = 'N'));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:anc_score; 6:strand;
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    $sth2 = $dbh->prepare(qq(SELECT coordinate, mel, sim_allele, anc
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth2->execute;
    $sth2->bind_columns(\$coordinate, \$mel, \$sim, \$anc);
    while($sth2->fetch){
	if($anc eq '?'){
	    $amb ++;
	    next;
	}
	$p = 0; $anc2 = $anc; $evo2 = 0; $change = 0; $prob = 0;
	for $evo(@nucl){
	    if($anc ne $evo){
		$prob = $subpro{$anc.$evo};
		$evo2 = $evo;
		if($strand eq '+'){
		    $p = $coordinate - $array[3];
		    $anc2 =~ tr/ACGT/0123/;
		    $evo2 =~ tr/ACGT/0123/;
		}elsif($strand eq '-'){
		    $p = $array[4] - $coordinate;
		    $anc2 =~ tr/ACGT/3210/;
		    $evo2 =~ tr/ACGT/3210/;
		}else{
		    die "$fpid\n";
		}
		$change = $$factor[4*$p+$evo2] - $$factor[4*$p+$anc2];
		print f_Output "$region\t$coordinate$evo\t$factor\t$array[0]\t$change\t$prob\n";
		#print "$strand\t$p\t$anc\t$evo\n";
		#print "nt\tA\tC\tG\tT\n";
		$a = 0;
		while($$factor[4*$a] ne '' && 0){
		    print "$a";
		    for($i = 0; $i < 4; $i ++){
			print "\t$$factor[4*$a+$i]";
		    }
		    print "\n";
		    $a ++;
		}
		#getc();
	    }
	}
	#print f_Output "$region\t$array[0]\t$array[1]\t$array[5]\t$coordinate\t$type\t$change\t$polyfreq\t$allele_no\n";
    }
    $sth2->finish;
}
print "ambiguous: $amb\n";
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
