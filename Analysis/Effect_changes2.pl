#################################
# perl Effect_change2.pl
# Created Dec 26th 07
# To polarize the substitutions
# within binding sites
# Modified Jan 8th 07
# To solve the bug of not 
# considering which strand (+/-)
# the feature is on
# Modified Apr 29th 08
# to include polymorphic sites
# Modified May 1st 08
# to find the cases where a 
# fixed substitution can change
# the orientation of the site
# hebin
#! /usr/bin/perl -W
#################################

################################################################################
# fpid factor region chr_arm coordinate pos species ancestral evolved direction
################################################################################

open f_Output, ">../Result/effects_changes.txt" ||
    die "Cannot open file";
#print f_Output "region\tfpid\tfactor\tstrand\tscore\tcoordinate\tpos\tspecies\tancestral\tevolved\tchange\n";

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

$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, anc_score, strand
			FROM tfbs 
			WHERE gapped = 'N'));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:anc_score; 6:strand;
(%div) = ('0',0,'1',0,'2',0,'3',0,'4',0,'5',0);
(%poly) = ('0',0,'1',0,'2',0,'3',0,'4',0,'5',0);
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    $sth2 = $dbh->prepare(qq(SELECT coordinate, mel, sim_allele, anc, poly_freq, allele_number, poly_Or_not
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth2->execute;
    #$sth2->bind_columns(\$coordinate, \$mel, \$sim, \$anc, \polyfreq, \$allele_no, \$poly_Or_not);
    (@temp) = ();(@array2) = ();
    $div = 0;
    $poly = 0;
    $melseq = '';
    while(@temp = $sth2->fetchrow_array){
	$div ++ if($temp[6] eq 'div');
	$poly ++ if($temp[6] eq 'poly');
	$melseq = $melseq.$temp[1];
	@array2 = (@array2, @temp);
    }
    $div{$div} ++;
    $poly{$poly} ++;
    $length = scalar(@array2)/7-1;
    for $i(0..$length){
	$coordinate = $array2[7*$i];
	$mel = $array2[7*$i + 1];
	$sim = $array2[7*$i + 2];
	$anc = $array2[7*$i + 3];
	$polyfreq = $array2[7*$i + 4];
	$allele_no = $array2[7*$i + 5];
	$poly_Or_not = $array2[7*$i + 6];
	#solve the ancestral state using parsimony;
	$type = ''; $evo = ''; $change = '';$p = -1;
	if($poly_Or_not eq 'div'){
	    if($anc eq '?'){
		$anc = $mel;
		$type = 'Amb';
		$evo = $sim;
	    }else{
		$type = $anc eq $mel ? 'sim':'mel';
		$evo = $anc eq $mel ? $sim:$mel;
	    }
	}elsif($poly_Or_not eq 'poly'){
	    $evo = $sim;
	    $type = 'poly';
	}else{
	    next;
	}
	$simseq = $melseq;
	substr($simseq, $i, 1) = $sim;
	$patser_seq = 'mel'."\t\\".$melseq."\\\n".'sim'."\t\\".$simseq."\\\n";
	$result = `echo -n '$patser_seq'|
                       ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -t -s -c|
                       grep 'position'`;
	(@pos) = ();
	while($result =~ /position\=\s+(\S+)/g){
	    @pos = (@pos, $1);
	}
	if($pos[0] ne $pos[1]){
	    print "$array[0]\t$factor\n$result";
	}
	#evaluate direction of changes;
	if($strand eq '+'){
	    $p = $coordinate - $array[3];
	    $anc =~ tr/ACGT/0123/;
	    $evo =~ tr/ACGT/0123/;
	}elsif($strand eq '-'){
	    $p = $array[4] - $coordinate;
	    $anc =~ tr/ACGT/3210/;
	    $evo =~ tr/ACGT/3210/;
	}else{
	    die "$fpid\n";
	}
	$change = $$factor[4*$p+$evo] - $$factor[4*$p+$anc];
	#print "$array[0]\t$array[1]\t$strand\t$type\t$p\t$anc\t$evo\t$change\t$polyfreq\t$allele_no\n";
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
	#print f_Output "$region\t$array[0]\t$array[1]\t$array[6]\t$array[5]\t$coordinate\t$p\t$species\t$ancestor\t$evolved\t$change\n";
    }
    $sth2->finish;
}
$sth->finish;
$dbh->disconnect;
print "no\tdiv\tpoly\n";
for (sort(keys %div)){
    print "$_\t$div{$_}\t$poly{$_}\n";
}
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
